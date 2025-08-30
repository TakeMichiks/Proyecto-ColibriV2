require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const session = require('express-session'); // Nuevo: Necesario para OAuth 2.0

const Register = require('./routes/Product.model.js');
const Login = require('./routes/Product.model.js');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Esquema de Mongoose para las imágenes
const imageSchema = new mongoose.Schema({
  name: String,
  googleDriveId: String,
  googleDriveUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Image = mongoose.model('Image', imageSchema);

// Middleware para procesar la subida del archivo
const upload = multer({ dest: 'uploads/' });

// --- NUEVA CONFIGURACIÓN DE AUTHENTICACIÓN CON OAUTH 2.0 ---

// Reemplaza con tus credenciales de cliente de la Consola de Google Cloud

const REDIRECT_URI = 'http://localhost:3000/api/auth/google/callback';
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// Cliente OAuth 2.0
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Middleware de sesión para manejar la autenticación
app.use(session({
    secret: 'tu-clave-secreta-para-sesiones', // Reemplaza con una clave segura
    resave: false,
    saveUninitialized: true
}));

// Variable global para el servicio de Drive, se inicializa al inicio
let driveService;

// Función para inicializar o cargar el servicio de Drive
async function getDriveService() {
    try {
        const tokens = JSON.parse(fs.readFileSync('token.json'));
        oauth2Client.setCredentials(tokens);
        // Opcional: refresca el token si está a punto de expirar
        if (oauth2Client.isTokenExpiring()) {
            await oauth2Client.refreshAccessToken();
        }
        return google.drive({ version: 'v3', auth: oauth2Client });
    } catch (error) {
        console.log('No se encontraron tokens. Por favor, autentica primero.');
        // Devuelve null si no se puede autenticar
        return null; 
    }
}

// NUEVAS RUTAS PARA EL FLUJO DE AUTENTICACIÓN
app.get('/api/auth/google', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/drive'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.redirect(url);
});

app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Guardar los tokens para futuras ejecuciones
    fs.writeFileSync('token.json', JSON.stringify(tokens));

    res.send('Autenticación exitosa. Tokens guardados en token.json.');
  } catch (error) {
    console.error('Error al obtener tokens:', error);
    res.status(500).send('Error de autenticación.');
  }
});

// --- RUTA DE SUBIDA DE IMAGEN MODIFICADA ---
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    // Verificar si el servicio de Drive está disponible
    if (!driveService) {
        return res.status(401).send('No se ha autenticado. Por favor, autentica primero visitando /api/auth/google.');
    }

    if (!req.file) {
      return res.status(400).send('No se ha subido ningún archivo.');
    }

    const { originalname, path: filePath } = req.file;

    // Subir la imagen a Google Drive
    const fileMetadata = {
      name: originalname,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path), 
    };

    const response = await driveService.files.create({ // <--- Usa la variable driveService aquí
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    const fileId = response.data.id;
    const webViewLink = response.data.webViewLink;

    // Eliminar el archivo temporal del servidor
    fs.unlinkSync(filePath);

    // Guardar la información en MongoDB
    const newImage = new Image({
      name: originalname,
      googleDriveId: fileId,
      googleDriveUrl: webViewLink,
    });
    await newImage.save();

    res.status(200).json({
      message: 'Imagen subida y guardada exitosamente.',
      data: newImage,
    });

  } catch (error) {
    console.error('Error al subir la imagen:', error);
    res.status(500).json({
      message: 'Ocurrió un error al procesar la solicitud.',
      error: error.message
    });
  }
});

app.use(express.json());
app.use("/api", Register);
app.use("/api", Login);

// Iniciar el servidor e inicializar el servicio de Drive
app.listen(port, async () => {
  driveService = await getDriveService();
  console.log(`Servidor escuchando en el puerto ${port}.`);
});