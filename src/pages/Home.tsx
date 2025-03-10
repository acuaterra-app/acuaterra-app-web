/**
 * Página de BIENVENIDA (Welcome).
 *  se sigue el diseño de Figma.
 */

import type { FC } from "react";
import { useNavigate } from "@tanstack/react-router";

// Importamos imágenes y logos
import acuaterraLogo from "../assets/images/logo.png";
import phoneHome from "../assets/images/phone.jpg"; // Imagen del Figma para el celular


const Welcome: FC = () => {
  const navigate = useNavigate();

  // Función que se ejecuta al hacer clic en "Comenzar!"
  // Puedes navegar a la ruta de login (Auth) o Home, según tu proyecto
  const handleStart = (): void => {
    void navigate({ to: "/auth" }); 
    // O si usas react-router-dom:
    // navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white font-sans p-8">
      {/* Sección izquierda: Logo, texto y botón */}
      <div className="md:w-1/2 flex flex-col items-center justify-center text-center space-y-6">
        {/* Logo de Acuaterra */}
        <img alt="Acuaterra Logo" className="h-[250px] mb-4" src={acuaterraLogo} />
  
        {/* Título principal */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          ¡Bienvenidos a Acuaterra!
        </h1>
  
        {/* Botón para iniciar */}
        <button
          className="
            bg-[#44cbd3] hover:bg-[#3cacac]
            text-white font-semibold px-6 py-3 
            rounded-lg transition
            focus:outline-none focus:ring-2 focus:ring-[#44cbd3]
          "
          onClick={handleStart}
        >
          ¡Comenzar!
        </button>
  
        {/* Footer con logo SENA y versión */}
        <div className="mt-8">
          <p className="text-xs text-gray-500">
            versión 1.0 - Advanced Aquaponics Monitoring System <br />
            AGUA TERRA © 2023
          </p>
        </div>
      </div>
  
      {/* Sección derecha: Imagen del teléfono con la app */}
      <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
        <img
          alt="Vista de la app en teléfono"
          className="max-h-[800px] object-contain"
          src={phoneHome}
        />
      </div>
    </div>
  );
  }
export default Welcome;
