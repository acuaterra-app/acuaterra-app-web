import { useState, useEffect } from "react";
// eslint-disable-next-line no-duplicate-imports
import type { FC } from "react";
import { useNavigate } from "@tanstack/react-router";


import { Menu, X } from "lucide-react";
import acuaterraLogo from "../assets/images/logo.png";
import homeIcon from "../assets/images/home.png";
import closeSessionIcon from "../assets/images/cerrar-sesion.png";
import reporteIcon from "../assets/images/reporte.png";
import moduleIcon from "../assets/images/module.png";
import userIcon from "../assets/images/userlogo.png";
import fishIcon from "../assets/images/pez.png";


import LoaderAcua from "../components/loaders/LoaderAcua";

const Report: FC = () => {
  const navigate = useNavigate();

 
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Cierra el menú si se hace clic fuera (solo en móvil)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const menuButton = document.getElementById("menu-button");
      if (
        isOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

 
  useEffect(() => {
    document.body.style.overflowY = isOpen ? "hidden" : "auto";
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [isOpen]);

  return (
    <div className="flex min-h-screen bg-white font-sans relative overflow-x-auto">
      
      <button
        className="absolute top-4 left-4 z-50 bg-gray-300 p-2 rounded shadow-md md:hidden"
        id="menu-button" //Imolemented menu for hamburguer menu
        onClick={() => { setIsOpen(!isOpen); }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

     
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 w-64 h-screen bg-gray-300 border-r border-gray-300 flex flex-col transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:w-64 md:relative`}
      >
        <div className="p-4 flex flex-col items-center relative">
     
          <button
            className="absolute top-2 right-2 p-2 text-gray-700 hover:text-gray-900 md:hidden"
            onClick={() => { setIsOpen(false); }}
          >
            <X size={24} />
          </button>
          <img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
          <p className="text-gray-700 font-semibold">Bienvenido, usuario!</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-3 md:space-y-20 mt-4 md:mt-20">
            <li
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
              onClick={async () => {
                await navigate({ to: "/newHome" });
                setIsOpen(false);
              }}
            >
              <img alt="Inicio" className="h-6 w-6 mr-2" src={homeIcon} />
              <span className="font-bold">Inicio</span>
            </li>
            <li
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
              onClick={async () => {
                await navigate({ to: "/farm" });
                setIsOpen(false);
              }}
            >
              <img alt="Granjas" className="h-6 w-6 mr-2" src={moduleIcon} />
              <span className="font-bold">Granjas</span>
            </li>
            <li
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
              onClick={async () => {
                await navigate({ to: "/users" });
                setIsOpen(false);
              }}
            >
              <img alt="Usuarios" className="h-6 w-6 mr-2" src={userIcon} />
              <span className="font-bold">Usuarios</span>
            </li>
            <li
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
              onClick={async () => {
                await navigate({ to: "/module" });
                setIsOpen(false);
              }}
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
                onClick={async () => {
                  await navigate({ to: "/auth" });
                  setIsOpen(false);
                }}
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
        {loading ? (
          <LoaderAcua />
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">Reportes</h1>
            <p className="text-gray-600 mb-6 text-center">
              Visualización y generación de reportes.
            </p>
          </>
        )}
      </main>
    </div>
  );
};

export default Report;