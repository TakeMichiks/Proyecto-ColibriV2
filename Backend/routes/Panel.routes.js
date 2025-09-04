// routes/Panel.routes.js
const express = require("express");
const Actividades = require("../Models/Actividades.js");

const router = express.Router();

// 📌 Guardar actividades
router.post("/", async (req, res) => {
  try {
    const { estudiantes, profesores, actividades, userId } = req.body;

    // Validar campos
    if (!estudiantes || !profesores || !actividades || !userId) {
      return res.status(400).json({
        message:
          "Datos incompletos. Se requieren estudiantes, profesores, actividades y userId.",
      });
    }

    // Crear documento
    const newActividades = new Actividades({
      estudiantes,
      profesores,
      actividades,
      userId,
    });

    // Guardar en la BD
    await newActividades.save();

    res.status(201).json({
      message: "Actividades guardadas con éxito.",
      data: newActividades,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al guardar las actividades.",
      error: error.message,
    });
  }
});

// 📌 Obtener actividades por usuario
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "El userId es requerido." });
    }

    // Buscar todas las actividades del usuario, ordenadas por fecha
    const data = await Actividades.find({ userId }).sort({ createdAt: -1 });

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron actividades para este usuario." });
    }

    res.status(200).json({
      message: "Actividades obtenidas con éxito.",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener actividades.",
      error: error.message,
    });
  }
});

module.exports = router;
