import type { FC } from "react";
// eslint-disable-next-line no-duplicate-imports
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import homeIcon from "../assets/images/home.png";
import moduleIcon from "../assets/images/module.png";
import acuaterraLogo from "../assets/images/logo.png";
import reportIcon from "../assets/images/reporte.png";
import LogoutButton from "../components/ui/button/logoutButton";
import userIcon from "../assets/images/userlogo.png";
import fishIcon from "../assets/images/pez.png";
import foto1 from "../assets/images/fotoAcuapico_1.jpg";
import foto2 from "../assets/images/fotoAcuapico_2.jpg";
import foto3 from "../assets/images/fotoAcuapico_3.jpg";
import Slider from "../components/Slider/Slider";
import MobileCarousel from "../components/Slider/MobileCarousel";
import { isTokenValid } from "../common/isTokenValid";

const Home: FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const sliderImages = [foto1, foto2, foto3];

    useEffect(() => {
      if (!isTokenValid()) {
        console.log("Redirigiendo a /auth desde el componente Home"); 
        void navigate({ to: "/auth" });
      }
    }, [navigate]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleNavigation = (path: string) => {
    void navigate({ to: path });
    setIsOpen(false);
  };

  return (
    <div className="flex min-h-screen font-sans bg-white relative overflow-x-auto">
      <button
        className="absolute top-4 left-4 z-50 bg-gray-300 p-2 rounded shadow-md md:hidden"
        id="menu-button"
        onClick={() => { setIsOpen(!isOpen); }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        ref={menuRef}
        className={`fixed top-0 left-0 w-64 h-screen bg-gray-300 border-r border-gray-300 flex flex-col transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:w-64 lg:relative`}
      >
        <div className="p-4 flex flex-col items-center relative">
          <button
            className="absolute top-2 right-2 p-2 text-gray-700 hover:text-gray-900 lg:hidden"
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
              className="flex items-center justify-center gap-3 p-2 cursor-pointer transition-all 
                         duration-300 transform origin-center overflow-hidden hover:bg-gray-400
                         hover:scale-102 bg-gray-400 text-white border-2 border-gray-400 rounded-lg"

              onClick={() => { handleNavigation("/"); }}
            >
              <img alt="Home" className="h-6 w-6" src={homeIcon} />
              <span className="font-bold">Inicio</span>
            </li>

            <li
              className="flex items-center justify-center gap-3 p-2 cursor-pointer transition-all  
                         duration-300 transform origin-center overflow-hidden hover:bg-gray-400 
                         hover:scale-102 rounded-lg"
              onClick={() => { handleNavigation("/farm"); }}
            >
              <img alt="Granjas" className="h-6 w-6" src={moduleIcon} />
              <span className="font-bold">Granjas</span>
            </li>

            <li
              className="flex items-center justify-center gap-3 p-2 cursor-pointer transition-all 
                         duration-300 transform origin-center overflow-hidden hover:bg-gray-400 
                         hover:scale-102 rounded-lg"
              onClick={() => { handleNavigation("/users"); }}
            >
              <img alt="Usuarios" className="h-6 w-6" src={userIcon} />
              <span className="font-bold">Usuarios</span>
            </li>

            <li
              className="flex items-center justify-center gap-3 p-2 cursor-pointer transition-all 
                         duration-300 transform origin-center overflow-hidden hover:bg-gray-400 
                         hover:scale-102 rounded-lg"
              onClick={() => { handleNavigation("/module"); }}
            >
              <img alt="Módulos" className="h-6 w-6" src={fishIcon} />
              <span className="font-bold">Módulos</span>
            </li>

            <li
              className="flex items-center justify-center gap-3 p-2 cursor-pointer transition-all  
                         duration-300 transform origin-center overflow-hidden hover:bg-gray-400 
                         hover:scale-102 rounded-lg"
              onClick={() => { handleNavigation("/report"); }}
            >
              <img alt="Reporte" className="h-6 w-6" src={reportIcon} />
              <span className="font-bold">Reporte</span>
            </li>
          </ul>

          <div className="mt-4 md:mt-20">
            <ul className="space-y-4">
              <li className="flex items-center justify-center gap-3 p-2 cursor-pointer transition-all 
                             duration-300 transform origin-center overflow-hidden hover:bg-gray-300 
                             hover:scale-102 rounded-lg">
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

      <main className="flex-1 p-6 bg-white lg:ml-0">
        <h1 className="text-2xl font-bold mb-5 text-center">Acuaterra</h1>
        <p className="text-gray-600 mb-6 text-lg sm:text-sm text-center">
          Acuaterra es una herramienta de software diseñada para sistematizar el proceso de monitoreo en módulos acuapónicos...
        </p>

        {isMobile ? (
          <MobileCarousel />
        ) : (
          <div
            className={`w-[1200px] mx-auto h-[800px] overflow-hidden relative transition-opacity duration-300 z-0 ${isOpen && window.innerWidth < 1024 ? "opacity-40" : "opacity-100"}`}
          >
            <Slider images={sliderImages} interval={5000} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
