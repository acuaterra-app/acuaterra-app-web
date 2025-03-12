import { useState, useEffect } from "react";
// eslint-disable-next-line no-duplicate-imports
import type { FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import acuaterraLogo from "../assets/images/logo.png";
import homeIcon from "../assets/images/home.png";
import closeSessionIcon from "../assets/images/cerrar-sesion.png";
import reporteIcon from "../assets/images/reporte.png";
import moduleIcon from "../assets/images/module.png";
import userIcon from "../assets/images/userlogo.png";
import fishIcon from "../assets/images/pez.png";


import Loader from "../components/loaders/Loader";

const Report: FC = () => {
  const navigate = useNavigate();
  
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => { setLoading(false); }, 2000);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => { clearTimeout(timer); };
  }, []);
  
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans bg-white">
      
      <aside className="w-full md:w-64 bg-gray-300 border-r border-gray-300 flex flex-col">
        <div className="p-4 flex flex-col items-center">
          <img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
          <p className="text-gray-700 font-semibold">Bienvenido, usuario!</p>
        </div>

        <nav className="flex-1">
          
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
              onClick={() => navigate({ to: "/farm" })}
            >
              <img alt="Módulos" className="h-6 w-6 mr-2" src={moduleIcon} />
              <span className="font-bold">Granjas</span>
            </li>

            <li
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
              onClick={() => navigate({ to: "/users" })}
            >
              <img alt="Usuarios" className="h-6 w-6 mr-2" src={userIcon} />
              <span className="font-bold">Usuarios</span>
            </li>
            <li
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
              onClick={() => navigate({ to: "/module" })}
            >
              <img alt="Módulos" className="h-6 w-6 mr-2" src={fishIcon} />
              <span className="font-bold">Módulos</span>
            </li>

            <li className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105 bg-gray-400 text-white border-2 border-gray-400 rounded-lg">
              <img alt="Reporte" className="h-6 w-6 mr-2" src={reporteIcon} />
              <span className="font-bold">Reporte</span>
            </li>
          </ul>
          
          <div className="mt-4 md:mt-20">
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

      
      <main className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Reportes</h1>
        <p className="text-gray-600 mb-6">Visualización y generación de reportes.</p>
       
      </main>
    </div>
  );
};

export default Report;
