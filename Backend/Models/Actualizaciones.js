const mongoose = require('mongoose');

const ActualizacionesSchema = new mongoose.Schema({
  actualizacionesActual: String,
  actualizacionesAnterior: String,
  actualizacionesProxima: String,
  userId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Actualizaciones', ActualizacionesSchema);
