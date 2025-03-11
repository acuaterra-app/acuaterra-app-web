/**
 * Página HOME - Acuaterra (NewHome).
 * Visual: Basado en el diseño del Figma.
 *
 * Cambios realizados:
 * 1. Se mantiene el tamaño original de las fotos.
 * 2. Se elimina el logo del SENA del sidebar.
 * 3. Se cambia el fondo del panel izquierdo a gris (bg-gray-200) para resaltar.
 * 4. Se ponen en negrita los textos "Inicio", "Usuarios", "Módulos" y "Cerrar Sesión"
 *    y se aumenta el espacio entre ellos (space-y-4).
 */

import type { FC } from "react";
import { useNavigate } from "@tanstack/react-router";

// Importación de logos e íconos
import homeIcon from "../assets/images/home.png";
import moduleIcon from "../assets/images/module.png";
import acuaterraLogo from "../assets/images/logo.png";
import reportIcon from "../assets/images/reporte.png";
import LogoutButton from "../components/ui/button/logoutButton";
import userIcon from "../assets/images/userlogo.png";
import fishIcon from "../assets/images/pez.png";

// Importar las fotos nuevas
import foto1 from "../assets/images/fotoAcuapico_1.jpg";
import foto2 from "../assets/images/fotoAcuapico_2.jpg";
import foto3 from "../assets/images/fotoAcuapico_3.jpg";

// Importa el componente Slider
import Slider from "../components/Slider/Slider";

const Home: FC = () => {
  const navigate = useNavigate();

  // Arreglo de imágenes para el slider
  const sliderImages = [foto1, foto2, foto3];

  return (
    <div className="flex min-h-screen font-sans bg-white">
      {/* Sidebar con fondo gris */}
      <aside className="w-64 bg-gray-300 border-r border-gray-300 flex flex-col">
        <div className="p-4 flex flex-col items-center">
          <img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
          <p className="text-gray-700 font-semibold">Bienvenido, usuario!</p>
        </div>

        
        {/* Menú de navegación */}
        <nav className="flex-1">
          <ul className="space-y-20 mt-20">
            <li className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105 bg-gray-400 text-white border-2 border-gray-400 rounded-lg">
              <img alt="Home" className="h-6 w-6 mr-2" src={homeIcon} />
              <span className="font-bold">Inicio</span>
            </li>
            <li 
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
              onClick={() => navigate({ to: "/farm" })}
            >
              <img alt="Usuarios" className="h-6 w-6 mr-2" src={moduleIcon} />
              <span className="font-bold">Granjas</span>
            </li>
            <li
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
              onClick={() => navigate({ to: "/users" })}
            >
              <img alt="Home" className="h-6 w-6 mr-2" src={userIcon} />
              <span className="font-bold">Usuarios</span>
            </li>
            <li
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
              onClick={() => navigate({ to: "/module" })}
            >
              <img alt="Home" className="h-6 w-6 mr-2" src={fishIcon} />
              <span className="font-bold">Módulos</span>
            </li>
            <li 
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
              onClick={() => navigate({ to: "/report" })}
            >
              <img alt="Módulos" className="h-6 w-6 mr-2" src={reportIcon} />
              <span className="font-bold">Reporte</span>
            </li>


          </ul>
          <div className="mt-20">
            <ul className="space-y-4">
              <li className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105">
                <LogoutButton />
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
        <h1 className="text-2xl font-bold mb-4">Acuaterra</h1>
        <p className="text-gray-600 mb-6">
          Acuaterra es una herramienta de software diseñada para sistematizar el
          proceso de monitoreo en módulos acuapónicos...
        </p>

        <div className="w-[1200px] mx-auto h-[800px] overflow-hidden">
         <Slider images={sliderImages} interval={5000} />
         </div>

      </main>
    </div>
  );
};

export default Home;
