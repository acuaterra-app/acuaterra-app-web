/**
 * Página de reportes (Report).
 * Visual: Formulario basado en el Figma.
 */

// Importación de imágenes
import acuaterraLogo from "../assets/images/logo.png";
import homeIcon from "../assets/images/home.png";
import closeSessionIcon from "../assets/images/cerrar-sesion.png";
import reporteIcon from "../assets/images/reporte.png";
import moduleIcon from "../assets/images/module.png";

// src/pages/Report.tsx
import type { FC } from "react";
import { useNavigate } from "@tanstack/react-router";

const Report: FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans bg-white">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-300 border-r border-gray-300 flex flex-col">
        <div className="p-4 flex flex-col items-center">
          <img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
          <p className="text-gray-700 font-semibold">Bienvenido, usuario!</p>
        </div>

        <nav className="flex-1">
          {/* Grupo 1: Elementos principales */}
          <ul className="space-y-4 md:space-y-20 mt-4 md:mt-20">
            <li
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
              onClick={() => navigate({ to: "/newHome" })}
            >
              <img alt="Inicio" className="h-6 w-6 mr-2" src={homeIcon} />
              <span className="font-bold">Inicio</span>
            </li>
            <li
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
              onClick={() => navigate({ to: "/module" })}
            >
              <img alt="Módulos" className="h-6 w-6 mr-2" src={moduleIcon} />
              <span className="font-bold">Módulos</span>
            </li>
            <li className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105 bg-gray-400 text-white border-2 border-gray-400 rounded-lg">
              <img alt="Reporte" className="h-6 w-6 mr-2" src={reporteIcon} />
              <span className="font-bold">Reporte</span>
            </li>
          </ul>
          {/* Grupo 2: "Cerrar Sesión" en bloque separado */}
          <div className="mt-4 md:mt-60">
            <ul className="space-y-4">
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
                onClick={() => navigate({ to: "/auth" })}
              >
                <img alt="Cerrar Sesión" className="h-6 w-6 mr-2" src={closeSessionIcon} />
                <span className="font-bold">Cerrar Sesión</span>
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-0">
          <p className="text-center text-xs mt-2">
            versión 1.0 <br /> Advanced Aquaponics Monitoring System
          </p>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Reportes</h1>
        <p className="text-gray-600 mb-6">Visualización y generación de reportes.</p>
        {/* Aquí podrías agregar tablas, gráficos o tarjetas dependiendo de tu Figma */}
      </main>
    </div>
  );
};

export default Report;