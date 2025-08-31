import React from 'react';
import styles from "./stylesPanel.module.css";
import { LuLayoutPanelLeft } from "react-icons/lu";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineHome } from "react-icons/ai";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiUserCircleGearThin } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import { IoImagesOutline } from "react-icons/io5";
function Panel({ onClickUploader, onClickCerrarSecion}) {

  return (
    <>
      <div class="hover:no-underline flex justify-center bg-black rounded-2xl p-5 w-full h-full items-center">
        <nav>
          <ul class="content-between flex flex-col gap-1">
            <li class=" flex justify-center items-center gap-2 h-12 w-37 rounded-sm hover:border-1 transition-all hover:bg-white hover:text-black ">
              <AiOutlineHome class="flex justify-center mt-1.5" />
              <a href="#" class="font-bold mt-0.5">
                Inicio
              </a>
            </li>
            <li class=" flex justify-center items-center gap-2 h-12 w-37 rounded-sm hover:border-1 transition-all hover:bg-white hover:text-black ">
              <LuLayoutPanelLeft class="flex justify-center mt-1.5" />
              <a href="#">Panel</a>
            </li>
            <li class="flex justify-center items-center gap-2  h-12 w-37 rounded-sm hover:border-1 transition-all hover:bg-white hover:text-black ">
              <AiOutlineUser class="flex justify-center mt-1.5" />
              <a href="#" class="font-bold mt-0.5">
                Estudiantes
              </a>
            </li>
            <li class="flex justify-center items-center gap-2 h-12 w-37 rounded-sm hover:border-1 transition-all hover:bg-white hover:text-black ">
              <LiaChalkboardTeacherSolid class="flex justify-center mt-1.5" />
              <a href="#" class="font-bold mt-0.5">
                Profesores
              </a>
            </li>
            <li class="flex justify-center items-center  gap-2 h-12 w-37 rounded-sm hover:border-1  transition-all hover:bg-white hover:text-black ">
              <PiUserCircleGearThin class="flex justify-center mt-1.5" />
              <a href="#" class="font-bold mt-0.5">
                Ajustes
              </a>
            </li>
          </ul>
          <div class=" flex flex-col  h-30 w-37 rounded-2xl transition-all duration-1000 delay-1000 ease-in-out ">
            <button
              onClick={onClickUploader}
              class="hover:bg-white rounded-sm hover:text-black flex flex-row gap-1.5 content-center justify-center"
            >
              <IoImagesOutline class="flex justify-center mt-1.5" />
              <span>Subir</span>
            </button>
            <div>
              <br />
            </div>

            <button
              onClick={onClickCerrarSecion}
              class="hover:border-b-2 border-solid border-transparent hover:rounded-2xl hover:bg-white hover:border-b-fuchsia-700 hover:text-black flex flex-row gap-1.5 justify-center "
            >
              <CiLogout class="flex justify-center mt-1.5" />
              Cerrar
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Panel;