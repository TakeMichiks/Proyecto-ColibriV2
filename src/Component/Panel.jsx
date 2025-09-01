import React, { useState, useEffect } from 'react';
import styles from "./stylesPanel.module.css";
import { LuLayoutPanelLeft } from "react-icons/lu";
import { AiOutlineUser, AiOutlineHome } from "react-icons/ai";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiUserCircleGearThin } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import { IoImagesOutline } from "react-icons/io5";

function Panel({ onClickUploader, onClickCerrarSecion}) {

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-6 h-screen">
        {" "}
        <div className="hidden md:flex md:col-span-1 justify-center bg-black rounded-2xl p-5 w-full items-start">
          <nav>
            <ul className="content-between flex flex-col gap-1">
              <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black ">
                <AiOutlineHome className="flex justify-center mt-1.5" />
                <a href="#" className="font-bold mt-0.5">
                  Inicio
                </a>
              </li>
              <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black ">
                <LuLayoutPanelLeft className="flex justify-center mt-1.5" />
                <a href="#" className="font-bold mt-0.5">
                  Panel
                </a>
              </li>
              <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black ">
                <AiOutlineUser className="flex justify-center mt-1.5" />
                <a href="#" className="font-bold mt-0.5">
                  Estudiantes
                </a>
              </li>
              <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:hover:text-black ">
                <LiaChalkboardTeacherSolid className="flex justify-center mt-1.5" />
                <a href="#" className="font-bold mt-0.5">
                  Profesores
                </a>
              </li>
              <li className="flex justify-center items-center gap-2 h-12 w-36 rounded-sm hover:border transition-all hover:bg-white hover:text-black ">
                <PiUserCircleGearThin className="flex justify-center mt-1.5" />
                <a href="#" className="font-bold mt-0.5">
                  Ajustes
                </a>
              </li>
            </ul>
            <div className="flex flex-col h-32 w-36 rounded-2xl transition-all duration-1000 delay-1000 ease-in-out">
              <button
                onClick={onClickUploader}
                className="hover:bg-white rounded-sm hover:text-black flex flex-row gap-1.5 content-center justify-center"
              >
                <IoImagesOutline className="flex justify-center mt-1.5" />
                <span>Subir</span>
              </button>
              <div>
                <br />
              </div>
              <button
                onClick={onClickCerrarSecion}
                className="hover:border-b-2 border-solid border-transparent hover:rounded-2xl hover:bg-white hover:border-b-fuchsia-700 hover:text-black flex flex-row gap-1.5 justify-center"
              >
                <CiLogout className="flex justify-center mt-1.5" />
                Cerrar
              </button>
            </div>
          </nav>
        </div>
        {/* Main content area */}
        <div className="bg-black col-span-1 md:col-span-2 ml-5">
          <div class="text-center">
            <h1>Escuela</h1>
            <p class="mt-2.5">Estudiantes totales</p>
            <p>profesores totales</p>
            <p>actividades toatales</p>
          </div>
        </div>
        {/* Updates area */}
        <div className="col-span-1 md:col-span-3 ml-5">
          <h1>Actualizaciones</h1>
        </div>
      </div>
    </>
  );
}

export default Panel;