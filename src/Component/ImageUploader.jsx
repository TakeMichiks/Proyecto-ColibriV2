
import React, { useState } from 'react';

function ImageUploader({onClickCloseUploader}) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          // Leer el mensaje de error del cuerpo de la respuesta
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(data => {
        console.log("Imagen subida con éxito:", data);
        alert("Imagen subida con éxito!");
      })
      .catch(error => {
        console.error("Error al subir la imagen:", error);
        alert("Error al subir la imagen: " + error.message);
      });
    } else {
      console.log("No se ha encontrado ninguna imagen para subir");
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Subir una imagen con JSX y React</h2>
      
      {/* Nuevo botón de autenticación */}
      <p>
        Si no puedes subir la imagen, primero debes autenticar tu backend.
      </p>
      <a href="http://localhost:3000/api/auth/google" target="_blank" rel="noopener noreferrer">
        <button type="button">Autenticar con Google</button>
      </a>

      <hr style={{ margin: '20px 0' }}/>
      
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="imageInput">
          <input
            id="imageInput"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <button type="button" onClick={() => document.getElementById('imageInput').click()}>
            {selectedImage ? `Imagen Seleccionada: ${selectedImage.name}` : 'Seleccionar Imagen'}
          </button>
        </label>
        
        <br/><br/>
        
        <button type="submit" disabled={!selectedImage}>
          Subir
        </button>
      </form>
      <button onClick={onClickCloseUploader}>Salir</button>

      {selectedImage && (
        <div style={{ marginTop: '20px' }}>
          <h4>Previsualización:</h4>
          <img 
            src={URL.createObjectURL(selectedImage)} 
            alt="Previsualización" 
            style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '4px' }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;