import React, { useState, useEffect } from "react";

export default function EscuelaModal({ isOpen, onClose, onSave, initialData }) {
  const [estudiantes, setEstudiantes] = useState(0);
  const [profesores, setProfesores] = useState(0);
  const [actividades, setActividades] = useState(0);

  // Inicializar inputs cuando se abre el modal
  useEffect(() => {
    if (initialData) {
      setEstudiantes(initialData.estudiantes || 0);
      setProfesores(initialData.profesores || 0);
      setActividades(initialData.actividades || 0);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación simple
    if (
      estudiantes === null ||
      profesores === null ||
      actividades === null
    ) {
      alert("Por favor completa todos los campos");
      return;
    }

    onSave({
      estudiantes: Number(estudiantes),
      profesores: Number(profesores),
      actividades: Number(actividades),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Actualizar Datos de la Escuela</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Estudiantes</label>
            <input
              type="number"
              value={estudiantes}
              onChange={(e) => setEstudiantes(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label>Profesores</label>
            <input
              type="number"
              value={profesores}
              onChange={(e) => setProfesores(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label>Actividades</label>
            <input
              type="number"
              value={actividades}
              onChange={(e) => setActividades(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-white"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded-md"
            >
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-600 rounded-md">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
