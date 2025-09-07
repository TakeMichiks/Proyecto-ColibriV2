import React, { useState, useEffect } from 'react';

function ActividadesModal({ isOpen, onClose, data, onSave }) {
    const [formData, setFormData] = useState({});
    const [newProperty, setNewProperty] = useState({ key: '', value: '' });
    const [activityName, setActivityName] = useState('');
    const [newActivityName, setNewActivityName] = useState(''); // <-- Nuevo estado para el nombre de la nueva actividad

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            const key = Object.keys(data)[0];
            const value = data[key];
            setActivityName(key);
            setFormData(value || {});
            setNewActivityName(''); // Limpia el estado de nueva actividad al editar una existente
        } else {
            setActivityName('');
            setFormData({});
            setNewActivityName(''); // Asegura que esté limpio al crear una nueva
        }
    }, [data]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewInputChange = (e) => {
        const { name, value } = e.target;
        setNewProperty({ ...newProperty, [name]: value });
    };

    const handleAddNewProperty = () => {
        if (newProperty.key && newProperty.value) {
            setFormData({ ...formData, [newProperty.key]: newProperty.value });
            setNewProperty({ key: '', value: '' });
        }
    };

    const handleRemoveProperty = (keyToRemove) => {
        const newFormData = { ...formData };
        delete newFormData[keyToRemove];
        setFormData(newFormData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const finalActivityName = activityName || newActivityName; // Usa el nombre de la actividad existente o el nuevo
        if (!finalActivityName) {
            alert('Por favor, ingresa un nombre para la actividad.');
            return;
        }

        const updatedData = { [finalActivityName]: formData };
        onSave(updatedData);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="modal-content bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
                {activityName ? (
                    <h2 className="text-xl font-bold mb-4 text-white">Editar: {activityName}</h2>
                ) : (
                    <h2 className="text-xl font-bold mb-4 text-white">Añadir Nueva Actividad</h2>
                )}
                
                <form onSubmit={handleSubmit}>
                    {/* Campo para el nombre de la actividad */}
                    {!activityName && (
                         <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400">
                                Nombre de la nueva actividad
                            </label>
                            <input
                                type="text"
                                value={newActivityName} // <-- Usamos el nuevo estado aquí
                                onChange={(e) => setNewActivityName(e.target.value)}
                                placeholder="Ej: Natación, Fútbol"
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                            />
                        </div>
                    )}

                    {/* Lista de propiedades existentes */}
                    {Object.entries(formData).map(([key, value]) => (
                        <div className="flex items-center mb-4" key={key}>
                            <div className="flex-1 mr-2">
                                <label className="block text-sm font-medium text-gray-400">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                <input
                                    type="text"
                                    name={key}
                                    value={value || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveProperty(key)}
                                className="mt-6 px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}

                    {/* Sección para añadir una nueva propiedad */}
                    <div className="mt-6 pt-4 border-t border-gray-700">
                        <h3 className="text-lg font-bold mb-2 text-white">Añadir nueva propiedad</h3>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                name="key"
                                value={newProperty.key}
                                onChange={handleNewInputChange}
                                placeholder="Nombre (Ej: Costo)"
                                className="block w-1/2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                            />
                            <input
                                type="text"
                                name="value"
                                value={newProperty.value}
                                onChange={handleNewInputChange}
                                placeholder="Valor"
                                className="block w-1/2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                            />
                            <button
                                type="button"
                                onClick={handleAddNewProperty}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                            >
                                Añadir
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Guardar Actividad
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ActividadesModal;