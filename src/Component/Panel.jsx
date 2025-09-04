import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import EscuelaModal from "./EscuelaModal";

export default function Panel({ onClickUploader, onClickCerrarSecion }) {
  const { user, logout } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/Panel?userId=${user._id}`);
        if (!response.ok) throw new Error("Error al obtener datos");
        const result = await response.json();
        setData(result.data[0] || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSave = async (updatedData) => {
    if (!user) return;

    try {
      const response = await fetch("http://localhost:3000/api/Panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedData, userId: user._id }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Error al guardar datos");

      setData(result.data); // Actualizar datos en el panel
      setIsModalOpen(false);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  if (!user) return <p className="text-white">Usuario no logueado.</p>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white font-sans">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col justify-between m-2 bg-black rounded-2xl p-5 w-48">
        <nav>
          <ul className="flex flex-col gap-1">
            <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black">
              <a href="#" className="font-bold mt-0.5">Inicio</a>
            </li>
            <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black">
              <a href="#" className="font-bold mt-0.5">Panel</a>
            </li>
          </ul>
        </nav>
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={() => { logout(); onClickCerrarSecion(); }}
            className="py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-4 overflow-auto">
        {/* Header */}
        <div className="bg-gray-800 p-6 rounded-lg mb-4">
          <h1 className="text-xl font-bold">Panel de Inicio</h1>
          <div className="text-sm mt-2 text-gray-400">ID de Usuario: {user._id}</div>
        </div>

        {/* Grilla con tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Escuela</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-gray-400 hover:text-white"
              >
                Editar
              </button>
            </div>

            {loading ? (
              <p className="text-gray-400">Cargando datos...</p>
            ) : data ? (
              <>
                <p>Estudiantes: {data.estudiantes}</p>
                <p>Profesores: {data.profesores}</p>
                <p>Actividades: {data.actividades}</p>
              </>
            ) : (
              <p>No se encontraron datos para este usuario.</p>
            )}
          </div>
        </div>

        {/* Botón subir imagen */}
        <button
          onClick={onClickUploader}
          className="mt-4 px-4 py-2 bg-purple-600 rounded-md"
        >
          Subir Imagen
        </button>
      </div>

      {/* Modal */}
      <EscuelaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={data || {}}
      />
    </div>
  );
}
