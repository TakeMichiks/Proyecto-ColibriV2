import React, { useState } from "react";

function ImageUploader({ onClickCloseUploader }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error interno del servidor");

      setMessage("Imagen subida con éxito!");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-sm text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Subir Imagen</h2>

        <form onSubmit={handleFormSubmit}>
          <label className="block mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="imageInput"
            />
            <button
              type="button"
              onClick={() => document.getElementById("imageInput").click()}
              className="w-full py-2 px-4 bg-purple-600 rounded-md hover:bg-purple-700 mb-2"
            >
              {selectedImage ? selectedImage.name : "Seleccionar Imagen"}
            </button>
          </label>

          <button
            type="submit"
            disabled={!selectedImage || loading}
            className="w-full py-2 px-4 bg-green-600 rounded-md hover:bg-green-700 mb-2"
          >
            {loading ? "Subiendo..." : "Subir Imagen"}
          </button>
        </form>

        <button
          onClick={onClickCloseUploader}
          className="w-full py-2 px-4 bg-gray-600 rounded-md hover:bg-gray-700"
        >
          Salir
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-yellow-300">{message}</p>
        )}

        {selectedImage && (
          <div className="mt-4 text-center">
            <h4 className="mb-2">Previsualización:</h4>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Previsualización"
              className="mx-auto rounded-md max-w-full max-h-60"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;
