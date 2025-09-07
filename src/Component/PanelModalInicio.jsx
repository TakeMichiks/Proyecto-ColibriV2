import React, { useState, useEffect } from 'react';
import { useUser } from "../context/UserContext";
import ActividadesModal from './TiposActividadesModal'; 

function PanelInicio({ onClickPanelModalInicio, onClickReturnPanel }) {
    const { user, logout } = useUser();
    const [loading, setLoading] = useState(true);
    const [TiposActividades, setTiposActividades] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedActividades, setSelectedActividades] = useState(null);

    const fetchData = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/TiposActividades?userId=${user._id}`);
            if (!response.ok) {
                throw new Error("Error en la obtención de la respuesta de las Actividades");
            }
            const result = await response.json();
            setTiposActividades(result.data?.[0]?.actividades || null);
        } catch (err) {
            console.error("Error al cargar actividades:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleSaveTiposActividades = async (updatedData) => {
        if (!user) {
            console.error("Usuario no autenticado, no se puede guardar.");
            return;
        }
        try {
            // Combinar los datos existentes con los datos actualizados del modal
            const actividadesToSave = {
                ...TiposActividades,
                ...updatedData
            };
            const dataToSend = { actividades: actividadesToSave, userId: user._id };
            
            const response = await fetch("http://localhost:3000/api/tiposactividades", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || `Error en la respuesta del servidor: ${response.status}`);
            }
            setIsModalOpen(false);
            await fetchData(); 
            setSelectedActividades(null);
        } catch (error) {
            console.error("Error al guardar las actividades:", error.message);
        }
    };

    const handleEditClick = (activityName, activityData) => {
        setSelectedActividades({ [activityName]: activityData });
        setIsModalOpen(true);
    };

    // Nueva función para el botón de "Añadir Actividad"
    const handleNewActivityClick = () => {
        setSelectedActividades({}); // Pasa un objeto vacío para indicar que es una nueva actividad
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <h1>Cargando...</h1>
            </div>
        );
    }
  
    const displayKeys = TiposActividades ? Object.keys(TiposActividades) : [];

    // Obtenemos las claves de las subpropiedades (columnas) de la primera actividad
    // Esto asegura que la tabla solo muestre las columnas relevantes
    const subKeys = displayKeys.length > 0 
        ? Object.keys(TiposActividades[displayKeys[0]])
        : [];

    return (
      <>
        <div className="flex flex-col md:flex-row bg-gray-900 text-white font-sans min-h-screen">
          {/* Sidebar */}
          <div className="hidden md:flex flex-col justify-between m-2 bg-black rounded-2xl p-5">
            <nav>
              <ul className="flex flex-col gap-1">
                <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black">
                  <a
                    href="#"
                    className="font-bold mt-0.5"
                    onClick={onClickReturnPanel}
                  >
                    Inicio
                  </a>
                </li>
                <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black">
                  <a href="#" className="font-bold mt-0.5">
                    Panel
                  </a>
                </li>
              </ul>
            </nav>
            <div className="flex flex-col gap-2 mt-auto">
              <button
                onClick={() => {
                  logout();
                  onClickPanelModalInicio();
                }}
                className="py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex flex-col p-4 bg-black min-h-max">
            <div className="flex mb-5 p-5 rounded-2xl bg-gray-800 justify-center content-center">
              <h1 className="text-3xl font-bold">Panel de Actividades</h1>
            </div>

            {/* Panel de Actividades */}
            <div className=" min-h-max min-w-max row-start-2 bg-gray-800 p-6 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-Audiowide">Tipos de Actividades</h1>
                {/* Botón para añadir una nueva actividad */}
                <button
                  onClick={handleNewActivityClick}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Añadir Actividad
                </button>
              </div>
              {TiposActividades && displayKeys.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className=" text-left text-sm font-light">
                    <thead className="border-b bg-gray-700 font-medium">
                      <tr>
                        <th scope="col" className="px-6 py-4">
                          Actividad
                        </th>
                        {subKeys.map((subKey) => (
                          <th scope="col" className="px-6 py-4" key={subKey}>
                            {subKey.charAt(0).toUpperCase() + subKey.slice(1)}
                          </th>
                        ))}
                        <th scope="col" className="px-6 py-4">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayKeys.map((key) => (
                        <tr className="border-b bg-gray-800" key={key}>
                          <td className="whitespace-nowrap px-6 py-4 font-bold">
                            {key}
                          </td>
                          {subKeys.map((subKey) => (
                            <td
                              className="whitespace-nowrap px-6 py-4"
                              key={`${key}-${subKey}`}
                            >
                              {TiposActividades[key][subKey]}
                            </td>
                          ))}
                          <td className="whitespace-nowrap px-6 py-4">
                            <button
                              onClick={() =>
                                handleEditClick(key, TiposActividades[key])
                              }
                              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No hay actividades registradas para este usuario.</p>
              )}
            </div>

            {/* Estudiantes que Participaron */}
            <div className=" bg-gray-800 p-6 rounded-lg mb-4">
              <h1 className="text-2xl font-semibold">
                Estudiantes que participaron
              </h1>
            </div>

            {/* Profesores encargados */}
            <div className=" bg-gray-800 p-6 rounded-lg">
              <h1 className="text-2xl font-semibold">Profesores encargados</h1>
            </div>
          </div>
        </div>
        <ActividadesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedActividades}
          onSave={handleSaveTiposActividades}
        />
      </>
    );
}

export default PanelInicio;