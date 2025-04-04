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
import styled from "styled-components";

const SidebarLogoWrapper = styled.div`
  .logo {
    width: 64px;
    height: 64px;
    animation: logo-spin 8s linear infinite; /* Animación de rotación */
  }

  @keyframes logo-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const WelcomeText = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1); /* Animación al pasar el puntero */
  }
`;

const LogoutButtonStyledWrapper = styled.div`
  .button {
    cursor: pointer;
    border: none;
    background: #3cacac;
    color: #fff;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    display: grid;
    place-content: center;
    transition: background 300ms, transform 200ms;
    font-weight: 600;
    margin: 0 auto;
  }

  .button__text {
    position: absolute;
    inset: 0;
    animation: text-rotation 8s linear infinite;

    > span {
      position: absolute;
      transform: rotate(calc(19deg * var(--index)));
      inset: 7px;
      font-size: 10px;
      color: #fff;
    }
  }

  .button__circle {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
    background: #fff;
    color: #84db7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button:hover {
    background: #000;
    transform: scale(1.05);
  }

  @keyframes text-rotation {
    to {
      rotate: 360deg;
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const LogoutButtonStyled = () => {
  return (
    <LogoutButtonStyledWrapper>
      <button className="button">
        <p className="button__text">
          {Array.from("CERRAR SESIÓN").map((char, index) => (
            <span key={index} style={{ "--index": index } as React.CSSProperties}>
              {char}
            </span>
          ))}
        </p>
        <div className="button__circle">
          <LogoutButton />
        </div>
      </button>
    </LogoutButtonStyledWrapper>
  );
};

const Home: FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [animateSidebar, setAnimateSidebar] = useState(false); // Controla la animación inicial
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
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      if (!isMobileView) {
        setAnimateSidebar(true);
        setTimeout(() => { setAnimateSidebar(false); }, 500); // Duración de la animación
      }
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
    };

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
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        ref={menuRef}
        className={`fixed top-0 left-0 w-64 h-screen bg-gray-300 border-r border-gray-300 flex flex-col transform transition-transform duration-300 ease-in-out z-50 shadow-lg ${
        isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
         } ${animateSidebar ? "animate-slide-in" : ""}`}
           style={{
            height: "100vh", // Asegura que la barra lateral ocupe toda la altura de la pantalla
            boxShadow: "5px 0 15px rgba(0, 0, 0, 0.2)", // Sombreado para la barra lateral
            }}
           >
        <div className="p-4 flex flex-col items-center relative">
        <button
           className="absolute top-2 right-2 p-2 text-gray-700 hover:text-gray-900 lg:hidden"
           onClick={() => {
           setIsOpen(false);
          }}
         >
           <X size={24} />
        </button>

        <SidebarLogoWrapper>
          <img alt="Acuaterra Logo" className="logo mb-2" src={acuaterraLogo} />
        </SidebarLogoWrapper>
        <WelcomeText>Bienvenido, usuario!</WelcomeText>
        </div>

        <nav className="flex-1 overflow-y-auto"> {/* Permite desplazamiento si el contenido excede */}
        <ul className="space-y-3 md:space-y-20 mt-4 md:mt-20">
         {[
            { icon: homeIcon, label: "Inicio", path: "" },
            { icon: moduleIcon, label: "Granjas", path: "/farm" },
            { icon: userIcon, label: "Usuarios", path: "/users" },
            { icon: fishIcon, label: "Módulos", path: "/module" },
            { icon: reportIcon, label: "Reporte", path: "/report" },
         ].map((item, index) => (
        <li
          key={index}
          className="relative group flex items-center justify-center gap-3 p-2 cursor-pointer overflow-hidden rounded-lg"
          onClick={() => {
            handleNavigation(item.path);
          }}
        >
          <span className="absolute inset-0 bg-[#3cacac] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-lg"></span>
          <span className="relative z-10 flex items-center gap-3 text-gray-700 group-hover:text-white font-bold">
            <img alt={item.label} className="h-6 w-6" src={item.icon} />
            {item.label}
          </span>
         </li>
         ))}
         </ul>
         <div className="mt-4 md:mt-20">
        <LogoutButtonStyled />
        </div>
       </nav> 
    </aside>

      <main className="flex-1 p-6 bg-white lg:ml-0">
        <h1 className="text-2xl font-bold mb-5 text-center">Acuaterra</h1>
        <p className="text-gray-600 mb-6 text-lg sm:text-sm text-center">
          Acuaterra es una herramienta de software diseñada para sistematizar el
          proceso de monitoreo en módulos acuapónicos
        </p>

        {isMobile ? (
          <MobileCarousel />
        ) : (
          <div
            className={`w-[1200px] mx-auto h-[800px] overflow-hidden relative transition-opacity duration-300 z-0 ${
              isOpen && window.innerWidth < 1024 ? "opacity-40" : "opacity-100"
            }`}
          >
            <Slider images={sliderImages} interval={5000} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;