import React from 'react';
import styles from "./stylesPanel.module.css";
import { LuLayoutPanelLeft } from "react-icons/lu";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineHome } from "react-icons/ai";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiUserCircleGearThin } from "react-icons/pi";
function Panel({ onClickUploader, onClickCerrarSecion}) {

  return (
    <>
      <div class="hover:no-underline flex justify-center bg-black rounded-2xl p-5 w-full h-full items-center">
        <nav>
          <ul class="content-between flex flex-col gap-1">
            <li class=" flex gap-2 justify-center w-37 h-9 rounded-sm hover:border-1 transition-all hover:bg-white hover:text-black ">
              <AiOutlineHome class="flex justify-center mt-1.5" />
              <a href="#" class="font-bold mt-0.5">
                Inicio
              </a>
            </li>
            <li class=" flex gap-2 justify-center w-37 h-9 rounded-sm hover:border-1 transition-all hover:bg-white hover:text-black ">
              <LuLayoutPanelLeft class="flex justify-center mt-1.5" />
              <a href="#">Panel</a>
            </li>
            <li class="  flex gap-2 justify-center w-37 h-9 rounded-sm hover:border-1 transition-all hover:bg-white hover:text-black ">
              <AiOutlineUser class="flex justify-center mt-1.5" />
              <a href="#" class="font-bold mt-0.5">
                Estudiantes
              </a>
            </li>
            <li class="  flex gap-2 justify-center w-37 h-9 rounded-sm hover:border-1 transition-all hover:bg-white hover:text-black ">
              <LiaChalkboardTeacherSolid class="flex justify-center mt-1.5" />
              <a href="#" class="font-bold mt-0.5">Profesores</a>
            </li>
            <li class="  flex gap-2 justify-center w-37 h-9 rounded-sm hover:border-1  transition-all hover:bg-white hover:text-black ">
              <PiUserCircleGearThin class="flex justify-center mt-1.5" />
              <a href="#" class="font-bold mt-0.5">Ajustes</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Renderiza el componente de subida de imágenes aquí */}
      <button onClick={onClickUploader}>Haz clic aquís</button>

      <div>
        <button
          onClick={onClickCerrarSecion}
          className="flex items-center gap-2" // Usa estas clases de Tailwind
        >
          <span>Sesión</span>
        </button>
      </div>
    </>
  );
}

export default Panel;