import acuaterraLogo from "../assets/images/logo.png";
import moduleIcon from "../assets/images/module.png";
import homeIcon from "../assets/images/home.png";
import closeSessionIcon from "../assets/images/cerrar-sesion.png";
import userIcon from "../assets/images/userlogo.png";
import reportIcon from "../assets/images/reporte.png";
import binnacleIcon from "../assets/images/bitacora.png";
import type { FC } from "react";

const ModuleRegister: FC = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-64 bg-gray-300 border-r border-gray-300 flex flex-col">
      <div className="p-4 flex flex-col items-center">
        <img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
        <p className="text-gray-700 font-semibold">Bienvenido, usuario!</p>
      </div>
      <nav className="flex-1">

        <ul className="space-y-20 mt-20">

           <li
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
            >
              <img alt="Inicio" className="h-6 w-6 mr-2" src={homeIcon} />
              <span className="font-bold">Inicio</span>
          </li>
          

          <li className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
          >
            <img alt="Usuarios" className="h-6 w-6 mr-2" src={userIcon} />
            <span className="font-bold">Usuarios</span>
          </li>


          <li className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
          >
            <img alt="Usuarios" className="h-6 w-6 mr-2" src={moduleIcon} />
            <span className="font-bold">Módulos</span>
          </li>


          <li className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
          >
            <img alt="Usuarios" className="h-6 w-6 mr-2" src={reportIcon} />
            <span className="font-bold">Reporte</span>
          </li>



          <li className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
          >
            <img alt="Usuarios" className="h-6 w-6 mr-2" src={binnacleIcon} />
            <span className="font-bold">Bitácoras</span>
          </li>
        </ul>

        <div className="mt-60">
               <ul className="space-y-4">
                 <li
                   className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                 >
                 
                   <img alt="Cerrar Sesión" className="h-6 w-6 mr-2" src={closeSessionIcon} />
                   <span className="font-bold">Cerrar Sesión</span>
                 </li>
               </ul>
             </div>
           </nav>
           
           <div className="p-0">
             <p className="text-center text-xs mt-2">
               versión 1.0 <br />
               Advanced Aquaponics Monitoring System
             </p>
           </div>
      </aside>
                    
      <main className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Formulario de Módulo</h1>
        <p className="text-gray-600 mb-6">Rellene cuidadosamente el formulario de inscripción.</p>

     
        <form className="max-w-lg space-y-4">
          <div>
            <label className="block font-semibold mb-1">Nombre</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              placeholder="Nombre del módulo"
              type="text"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Ubicación</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              placeholder="Ubicación física"
              type="text"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Especie de Pescados</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              placeholder="Trucha, Tilapia, etc."
              type="text"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Cantidad de Pescados</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              placeholder="Ej: 50"
              type="number"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Edad de Pescados</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              placeholder="Ej: 3 meses"
              type="text"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Dimensiones</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              placeholder="Ej: 2m x 1m"
              type="text"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">ID Persona</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              placeholder="Persona encargada"
              type="number"
            />
          </div>
          <button
            className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 transition"
            type="submit"
          >
            Registrar
          </button>
        </form>
      </main>
    </div>
  );
};

export default ModuleRegister;
