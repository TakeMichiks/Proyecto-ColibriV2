const express = require("express");
const TiposActividades = require("../Models/TiposActividades.js"); 
const router = express.Router();

// Ruta para obtener los tipos de actividades
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        message: "Se requiere el ID de usuario para obtener las actividades.",
      });
    }

    const actividades = await TiposActividades.find({ userId: userId });
    res.status(200).json({
      message: "Datos obtenidos con éxito",
      data: actividades,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error en el servidor al obtener datos",
      error: err.message,
    });
  }
});

// Ruta para guardar una nueva actividad
router.post("/", async (req, res) => {
  try {
    const { userId, ...actividadesData } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "Datos incompletos. Por favor, proporciona el ID de usuario y los campos de actividad.",
      });
    }

    const newTiposActividades = new TiposActividades({
      ...actividadesData,
      userId,
    });

    await newTiposActividades.save();

    res.status(201).json({
      message: "Datos guardados con éxito",
      data: newTiposActividades,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error en el servidor",
      error: err.message,
    });
  }
});

// Ruta para actualizar una actividad existente (CORREGIDA)
router.put("/", async (req, res) => {
    try {
        const { userId, actividades } = req.body; // <-- Desestructura 'actividades' directamente
        
        if (!userId) {
            return res.status(400).json({
                message: "No se proporcionó el User ID.",
            });
        }
        
        // Se asegura de que se proporcionen datos de actividades
        if (!actividades || Object.keys(actividades).length === 0) {
            return res.status(400).json({
                message: "No se proporcionaron datos de actividades para actualizar.",
            });
        }

        const updatedDoc = await TiposActividades.findOneAndUpdate(
            { userId: userId },
            { actividades: actividades }, // <-- Guarda el objeto de actividades completo
            {
                new: true, 
                upsert: true, 
                runValidators: true
            }
        );

        if (!updatedDoc) {
            return res.status(404).json({
                message: "No se pudo actualizar o crear la actividad",
            });
        }

        res.status(200).json({
            message: "Actividades guardadas con éxito",
            data: updatedDoc,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error en el servidor al guardar actividades",
            error: err.message,
        });
    }
});

module.exports = router;