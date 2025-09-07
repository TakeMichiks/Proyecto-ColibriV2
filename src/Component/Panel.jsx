import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import EscuelaModal from "./EscuelaModal";
import PanelModalInicio from "./PanelModalInicio"
import { LuLayoutPanelLeft } from "react-icons/lu";
import { AiOutlineUser, AiOutlineHome } from "react-icons/ai";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiUserCircleGearThin } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import { IoImagesOutline } from "react-icons/io5";
import { FaPencilAlt } from "react-icons/fa";

export default function Panel({ onClickUploader, onClickCerrarSecion , onClickPanelModalInicio}) {
  const { user, logout } = useUser();
  const [actividades, setActividades] = useState(null);
  const [actualizaciones, setActualizaciones] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEscuelaModalOpen, setIsEscuelaModalOpen] = useState(false);
  const [isActualizacionesModalOpen, setIsActualizacionesModalOpen] = useState(false);
  const [isSavingActualizaciones, setIsSavingActualizaciones] = useState(false);

  const [actualizacionesActualInput, setActualizacionesActualInput] = useState('');
  const [actualizacionesAnteriorInput, setActualizacionesAnteriorInput] = useState('');
  const [actualizacionesProximaInput, setActualizacionesProximaInput] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [actividadesResponse, actualizacionesResponse] = await Promise.all([
          fetch(`http://localhost:3000/api/Panel?userId=${user._id}`),
          fetch(`http://localhost:3000/api/actualizaciones?userId=${user._id}`)
        ]);

        const actividadesResult = await actividadesResponse.json();
        const actualizacionesResult = await actualizacionesResponse.json();

        if (!actividadesResponse.ok) throw new Error("Error al obtener datos de actividades");
        if (!actualizacionesResponse.ok) throw new Error("Error al obtener datos de actualizaciones");

        setActividades(actividadesResult.data[0] || null);
        setActualizaciones(actualizacionesResult.data[0] || null);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSaveActividades = async (updatedData) => {
    if (!user) return;

    try {
      const response = await fetch("http://localhost:3000/api/Panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedData, userId: user._id }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Error al guardar datos de actividades");

      setActividades(result.data);
      setIsEscuelaModalOpen(false);
    } catch (error) {
      console.error(error.message);
    }
  };

const handleSaveActualizaciones = async (e) => {
  e.preventDefault();
  if (!user) {
      console.error("Error: userId no está disponible.");
      return;
  }

  setIsSavingActualizaciones(true);

  try {
    const response = await fetch('http://localhost:3000/api/actualizaciones', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actualizacionesActual: actualizacionesActualInput,
        actualizacionesAnterior: actualizacionesAnteriorInput,
        actualizacionesProxima: actualizacionesProximaInput,
        userId: user._id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Detalle del error:", errorText);
      throw new Error('Error al guardar las actualizaciones.');
    }

    const result = await response.json();
    setActualizaciones(result.data);
    setIsActualizacionesModalOpen(false);
  } catch (error) {
    console.error('Error al guardar datos de actualizaciones:', error);
  } finally {
    setIsSavingActualizaciones(false);
  }
};

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white font-sans">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col justify-between m-2 bg-black rounded-2xl p-5 w-48">
        <nav>
          <ul className="flex flex-col gap-1">
            <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black">
              <a href="#" className="font-bold mt-0.5">
                Inicio
              </a>
            </li>
            <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black">
              <a href="#" className="font-bold mt-0.5" onClick={()=> {
                onClickPanelModalInicio();
              }}>
                Panel
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={() => {
              logout();
              onClickCerrarSecion();
            }}
            className="py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        {/* Header */}
        <div className="bg-gray-800 p-6 rounded-lg mb-4">
          <h1 className="text-xl font-bold">Panel de Inicio</h1>
          <div className="text-sm mt-2 text-gray-400">
            ID de Usuario: {user._id}
          </div>
        </div>

        {/* School Data Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Escuela</h2>
              <button
                onClick={() => setIsEscuelaModalOpen(true)}
                className="text-gray-400 hover:text-white"
              >
                Editar
              </button>
            </div>
            {loading ? (
              <p className="text-gray-400">Cargando datos...</p>
            ) : actividades ? (
              <>
                <p>Estudiantes: {actividades.estudiantes}</p>
                <p>Profesores: {actividades.profesores}</p>
                <p>Actividades: {actividades.actividades}</p>
              </>
            ) : (
              <p>No se encontraron datos para este usuario.</p>
            )}
          </div>

          {/* Updates Card */}
          <div className="bg-black p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Actualizaciones</h2>
              <button
                onClick={() => setIsActualizacionesModalOpen(true)}
                className="text-gray-400 hover:text-white"
                disabled={loading}
              >
                Editar
              </button>
            </div>
            {loading ? (
              <p className="text-gray-400">Cargando datos...</p>
            ) : actualizaciones ? (
              <>
                <p>Próxima: {actualizaciones.actualizacionesProxima}</p>
                <p>Actual: {actualizaciones.actualizacionesActual}</p>
                <p>Anterior: {actualizaciones.actualizacionesAnterior}</p>
                
              </>
            ) : (
              <p>No se encontraron actualizaciones para este usuario.</p>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={onClickUploader}
          className="mt-4 px-4 py-2 bg-purple-600 rounded-md"
        >
          Subir Imagen
        </button>
      </div>

      {/* School Modal */}
      <EscuelaModal
        isOpen={isEscuelaModalOpen}
        onClose={() => setIsEscuelaModalOpen(false)}
        onSave={handleSaveActividades}
        initialData={actividades || {}}
      />

      {/* Updates Modal */}
      {isActualizacionesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Editar Actualizaciones</h2>
            <form onSubmit={handleSaveActualizaciones}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="actual"
                >
                  Actual
                </label>
                <input
                  type="text"
                  id="actual"
                  value={actualizacionesActualInput}
                  onChange={(e) =>
                    setActualizacionesActualInput(e.target.value)
                  }
                  className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="anterior"
                >
                  Anterior
                </label>
                <input
                  type="text"
                  id="anterior"
                  value={actualizacionesAnteriorInput}
                  onChange={(e) =>
                    setActualizacionesAnteriorInput(e.target.value)
                  }
                  className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="proxima"
                >
                  Próxima
                </label>
                <input
                  type="text"
                  id="proxima"
                  value={actualizacionesProximaInput}
                  onChange={(e) =>
                    setActualizacionesProximaInput(e.target.value)
                  }
                  className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsActualizacionesModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isSavingActualizaciones
                      ? "bg-purple-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                  disabled={isSavingActualizaciones || !user}
                >
                  {isSavingActualizaciones ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
