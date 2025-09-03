import React from 'react';
import styles from "./stylesPanel.module.css";
import { LuLayoutPanelLeft } from "react-icons/lu";
import { AiOutlineUser, AiOutlineHome } from "react-icons/ai";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiUserCircleGearThin } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import { IoImagesOutline } from "react-icons/io5";


function Panel({ onClickUploader, onClickCerrarSecion }) {
  return (
    <>
    
      {/* .parent */}
      <div className="grid grid-cols-6 grid-rows-5 gap-2 h-screen">
        {/* .div1: Title/Header area */}
        <div className="col-span-6 col-start-2 row-start-1 ml-6 mt-6 bg-gray-600 p-3 flex justify-center w-full rounded-md">
          <h1 class="font-Michroma">Panel de Incio</h1>
        </div>

        {/* .div2: Navigation Panel */}
        <div className="row-span-5 col-start-1 row-start-1 hidden md:flex flex-col justify-center m-2 bg-black rounded-2xl p-5 w-full items-center">
          <nav>
            <ul className="flex flex-col gap-1">
              <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black ">
                <AiOutlineHome className="mt-1.5" />
                <a href="#" className="font-bold mt-0.5">
                  Inicio
                </a>
              </li>
              <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black ">
                <LuLayoutPanelLeft className="mt-1.5" />
                <a href="#" className="font-bold mt-0.5">
                  Panel
                </a>
              </li>
              <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black ">
                <AiOutlineUser className="mt-1.5" />
                <a href="#" className="font-bold mt-0.5">
                  Estudiantes
                </a>
              </li>
              <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black ">
                <LiaChalkboardTeacherSolid className="mt-1.5" />
                <a href="#" className="font-bold mt-0.5">
                  Profesores
                </a>
              </li>
              <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black ">
                <PiUserCircleGearThin className="mt-1.5" />
                <a href="#" className="font-bold mt-0.5">
                  Ajustes
                </a>
              </li>
            </ul>
            <div className="flex flex-col h-32 w-36 rounded-2xl mt-4">
              <button
                onClick={onClickUploader}
                className="hover:bg-white rounded-sm hover:text-black flex flex-row gap-1.5 justify-center items-center"
              >
                <IoImagesOutline className="mt-1.5" />
                <span>Subir</span>
              </button>
              <br />
              <button
                onClick={onClickCerrarSecion}
                className="hover:border-b-2 border-solid border-transparent hover:rounded-2xl hover:bg-white hover:border-b-fuchsia-700 hover:text-black flex flex-row gap-1.5 justify-center items-center"
              >
                <CiLogout className="mt-1.5" />
                Cerrar
              </button>
            </div>
          </nav>
        </div>

        {/* .div3: Main content area (School Stats) */}
        <div className="bg-black col-span-2 row-span-4 ml-5 col-start-2 row-start-2 w-auto h-auto p-5 rounded-sm">
          <div className="ml-2 flex flex-col gap-15 ">
            <h1 class="">Escuela</h1>
            <p className="mt-2.5">Estudiantes totales</p>
            <p>profesores totales</p>
            <p>actividades toatales</p>
          </div>
        </div>

        {/* .div4: Updates area */}
        <div className="col-span-2 row-span-4 col-start-4 row-start-2 p-5">
          <h1>Actualizaciones</h1>
        </div>
      </div>
    </>
  );
}

export default Panel;