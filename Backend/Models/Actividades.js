// models/Actividades.js
const mongoose = require("mongoose");

const actividadesSchema = new mongoose.Schema(
  {
    estudiantes: {
      type: [String], // lista de estudiantes
      required: true,
    },
    profesores: {
      type: [String], // lista de profesores
      required: true,
    },
    actividades: {
      type: [String], // lista de actividades
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, // referencia al usuario
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // añade createdAt y updatedAt automáticamente
  }
);

module.exports = mongoose.model("Actividades", actividadesSchema);
