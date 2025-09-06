const express = require("express");
const Actualizaciones = require("../Models/Actualizaciones.js");
const router = express.Router();

// Ruta para guardar una nueva Actualización
router.post("/", async (req, res) => {
    try {
        const {
            actualizacionesActual,
            actualizacionesAnterior,
            actualizacionesProxima,
            userId
        } = req.body;

        if (!actualizacionesActual || !actualizacionesAnterior || !actualizacionesProxima || !userId) {
            return res.status(400).json({
                message: "Datos incompletos. Por favor, proporciona todos los campos."
            });
        }
        
        const newActualizaciones = new Actualizaciones({
            actualizacionesActual,
            actualizacionesAnterior,
            actualizacionesProxima,
            userId,
        });

        await newActualizaciones.save();
        
        res.status(200).json({
            message: "Datos guardados con éxito.",
            data: newActualizaciones,
        });
    } catch (error) {
        res.status(500).json({
            message: "El servidor no pudo procesar los datos.",
            error: error.message,
        });
    }
});

// Ruta para obtener las Actualizaciones de un usuario
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({
                message: "El userId es requerido."
            });
        }
        
        const data = await Actualizaciones.find({
            userId
        }).sort({
            createdAt: -1
        });

        if (!data || data.length === 0) {
            return res
                .status(404)
                .json({
                    message: "No se encontraron Actualizaciones para este usuario."
                });
        }
        
        res.status(200).json({
            message: "Actualizaciones obtenidas con éxito.",
            data,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error en el servidor al obtener los datos.",
            error: error.message,
        });
    }
});
router.put("/", async (req, res) => {
    try {
        const {
            actualizacionesActual,
            actualizacionesAnterior,
            actualizacionesProxima,
            userId
        } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "El userId es requerido para la actualización."
            });
        }

        // Usa findOneAndUpdate para buscar por userId y actualizar
        const updatedDoc = await Actualizaciones.findOneAndUpdate(
            { userId: userId },
            {
                actualizacionesActual: actualizacionesActual,
                actualizacionesAnterior: actualizacionesAnterior,
                actualizacionesProxima: actualizacionesProxima,
            },
            {
                new: true, // Devuelve el documento actualizado en lugar del original
                upsert: true // Crea el documento si no se encuentra
            }
        );

        if (!updatedDoc) {
            return res.status(404).json({
                message: "No se encontró el documento para actualizar."
            });
        }

        res.status(200).json({
            message: "Datos actualizados con éxito.",
            data: updatedDoc,
        });

    } catch (error) {
        res.status(500).json({
            message: "El servidor no pudo procesar la actualización.",
            error: error.message,
        });
    }
});

module.exports = router;
