import React from 'react';
import styles from "./stylesPanel.module.css";
import ImageUploader from './ImageUploader'; // Importa el nuevo componente

function Panel({ onClickUploader, onClickCerrarSecion}) {

  return (
    <>
      <div className={styles.Content}>
        <nav>
          <ul>
            <li><a href="#">inicio</a></li>
            <li><a href="#">Panel</a></li>
            <li><a href="#">Estudiantes</a></li>
            <li><a href="#">Profesores</a></li>
            <li><a href="#">Ajustes</a></li>
          </ul>
        </nav>
      </div>

      {/* Renderiza el componente de subida de imágenes aquí */}
    <button onClick={onClickUploader}>
      Haz clic aquí
      </button>

      <div>
        <button onClick={onClickCerrarSecion}>Cerrar Sesion</button>
      </div>
    </>
  );
}

export default Panel;