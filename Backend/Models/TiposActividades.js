const mongoose = require('mongoose');

const tiposActividadesSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        // Aquí se definen los campos de actividad de forma flexible
        // El tipo 'mongoose.Schema.Types.Mixed' permite guardar objetos con cualquier tipo de campo
        actividades: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('TiposActividades', tiposActividadesSchema);