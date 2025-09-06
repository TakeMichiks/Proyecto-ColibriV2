require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const cors = require('cors');

const authRoutes = require("./routes/auth.routes.js");
const panelRoutes = require("./routes/Panel.routes.js");
const ActualizacionesRoutes = require("./routes/Actualizaciones.routes.js");

const app = express();
const port = process.env.PORT || 3000;

// Verificación de variables de entorno
const requiredEnvVars = ['MONGO_URI', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_DRIVE_FOLDER_ID'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error(`Error: Faltan variables de entorno requeridas: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

// Configuración de multer mejorada
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024
    },
    fileFilter: fileFilter
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-but-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  });

// Modelo de Imagen
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

// Configuración OAuth2
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

// Función para gestionar tokens de Google
async function ensureValidToken() {
    try {
        if (fs.existsSync('token.json')) {
            const tokens = JSON.parse(fs.readFileSync('token.json'));
            oauth2Client.setCredentials(tokens);
            
            if (tokens.expiry_date && tokens.expiry_date < Date.now() + 30000) {
                const { credentials } = await oauth2Client.refreshAccessToken();
                fs.writeFileSync('token.json', JSON.stringify(credentials));
                oauth2Client.setCredentials(credentials);
                console.log('Token de Google actualizado');
            }
            return google.drive({ version: 'v3', auth: oauth2Client });
        }
        return null;
    } catch (error) {
        console.error('Error gestionando tokens de Google:', error);
        return null;
    }
}

// Rutas de autenticación
app.get('/api/auth/google', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/drive.file'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
  res.redirect(url);
});

app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync('token.json', JSON.stringify(tokens));
    res.send('Autenticación exitosa. Ya puedes subir archivos.');
  } catch (error) {
    console.error('Error al obtener tokens:', error);
    res.status(500).send('Error de autenticación.');
  }
});

// Ruta de subida mejorada
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        const driveService = await ensureValidToken();
        if (!driveService) {
            return res.status(401).json({ 
                message: 'No autenticado con Google Drive. Visita /api/auth/google primero.' 
            });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
        }

        const fileMetadata = {
            name: `${Date.now()}_${req.file.originalname}`,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
        };

        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path),
        };

        const response = await driveService.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
        });

        fs.unlinkSync(req.file.path);

        const newImage = new Image({
            name: req.file.originalname,
            googleDriveId: response.data.id,
            googleDriveUrl: response.data.webViewLink,
        });
        
        await newImage.save();

        res.status(200).json({
            message: 'Imagen subida y guardada exitosamente.',
            data: newImage,
        });

    } catch (error) {
        console.error('Error al subir la imagen:', error);
        
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            message: 'Error interno del servidor al procesar la solicitud.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Ocurrió un error'
        });
    }
});

// Usar rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/panel", panelRoutes);
app.use('/api/actualizaciones', ActualizacionesRoutes);

// Manejo de rutas no encontradas
// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de errores global
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}.`);
    // Verificar autenticación con Google al iniciar
    ensureValidToken().then(driveService => {
        if (driveService) {
            console.log('Autenticación con Google Drive verificada.');
        } else {
            console.log('No autenticado con Google Drive. Los usuarios necesitarán autenticarse.');
        }
    });
});