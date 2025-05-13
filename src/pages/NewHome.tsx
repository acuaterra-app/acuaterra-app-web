/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { FC } from "react";
// eslint-disable-next-line no-duplicate-imports
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import homeIcon from "../assets/images/home.png";
import moduleIcon from "../assets/images/module.png";
import acuaterraLogo from "../assets/images/logo.png";
import LogoutButton from "../components/ui/button/logoutButton";
import reportIcon from "../assets/images/reporte.png";
import userIcon from "../assets/images/userlogo.png";
import fishIcon from "../assets/images/pez.png";
import foto1 from "../assets/images/fotoAcuapico_1.jpg";
import foto2 from "../assets/images/fotoAcuapico_2.jpg";
import foto3 from "../assets/images/fotoAcuapico_3.jpg";
import { Carousel } from "../components/Slider/Carousel";
import styled from "styled-components";
import { isTokenValid } from "../common/isTokenValid";
import MobileCarousel from "../components/Slider/MobileCarousel";
import { useDashboardStats, useDashboardMetrics } from "../hooks/useDashboardStats";
import DashboardStats from "../components/charts/pie/dashboardStats";
import DashboardMetrics from "../components/charts/pie/dashboardMetrics";


// Styled component for the sidebar logo
const SidebarLogoWrapper = styled.div`
  .logo {
    width: 80px;
    height: 80px;
    transition: transform 0.3s ease;
  }

  .logo:hover {
    transform: scale(1.1);
  }
`;

// Styled component for the welcome text
const WelcomeText = styled.p<{ darkMode: boolean }>`
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  margin-top: 0.5rem;
  color: ${(props: { darkMode: boolean }) => (props.darkMode ? "white" : "#4a4a4a")};
  transition: transform 0.3s ease, color 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

// Styled component for the logout button
const LogoutButtonStyledWrapper = styled.div`
  .button {
    cursor: pointer;
    border: none;
    background: #3cacac;
    color: #fff;
    width: 120px;
    height: 120px;
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
      font-size: 14px;
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
    transform: scale(1.1);
  }

  @keyframes text-rotation {
    to {
      rotate: 360deg;
    }
  }
`;

// Logout button component
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

// Main component for the NewHome page
const NewHome: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [animateSidebar, setAnimateSidebar] = useState(false);
  const [userName, setUserName] = useState<string>("Usuario");
  const [darkMode, setDarkMode] = useState(false);
  const { stats, loading, error } = useDashboardStats();
  const { metrics, loading: metricsLoading, error: metricsError } = useDashboardMetrics();
  const menuRef = useRef<HTMLDivElement>(null);
  const slides = [
    { title: "Acuaterra Modulo",  button: "1", src: foto1 },
    { title: "Modulo Acuaponico", button: "2", src: foto2 },
    { title: "Acuaterra Granja",  button: "3", src: foto3 },
  ];

  // Check token validity and set user name
  useEffect(() => {
    if (!isTokenValid()) {
      console.log("Redirecting to /auth from NewHome component");
      void navigate({ to: "/auth" });
    } else {
      const name = localStorage.getItem("userName");
      console.log("User name retrieved from localStorage:", name);
      setUserName(name || "Usuario");
    }
  }, [navigate]);

  // Handle screen resizing for mobile view
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      if (!isMobileView) {
        setAnimateSidebar(true);
        setTimeout(() => {
          setAnimateSidebar(false);
        }, 500);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Retrieve dark mode state from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.body.classList.toggle("dark-mode", savedDarkMode);
  }, []);

  // Toggle dark mode and save state to localStorage
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.body.classList.toggle("dark-mode", newDarkMode);
  };

  // Close sidebar when navigating to /newhome
  useEffect(() => {
    if (location.pathname === "/newhome") {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Handle navigation to a new path
  const handleNavigation = (path: string) => {
    void navigate({ to: path });
    setIsOpen(false);
  };

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Sidebar toggle button for mobile */}
      <button
        className="absolute top-4 left-4 z-50 bg-[#d3d3d3] p-2 rounded shadow-md md:hidden"
        id="menu-button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        ref={menuRef}
        className={`fixed top-0 left-0 w-64 h-screen ${
          darkMode ? "bg-gray-800 text-white" : "bg-[#e0e0e0] text-gray-600"
        } border-r border-gray-400 flex flex-col transform transition-transform duration-300 ease-in-out z-50 shadow-lg ${
          isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
        } ${animateSidebar ? "animate-slide-in" : ""}`}
        style={{
          height: "100vh",
          boxShadow: "5px 0 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="p-4 flex flex-col items-center relative">
         {/* Close button for sidebar */}
         <button
           className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200 lg:hidden"
           onClick={() => {
           setIsOpen(false); // Asegúrate de que esto cierre el menú
       }}
    >
       <X size={24} />
      </button>

          {/* Sidebar logo */}
          <SidebarLogoWrapper>
            <img alt="Acuaterra Logo" className="logo mb-2" src={acuaterraLogo} />
          </SidebarLogoWrapper>

          {/* Welcome text */}
          <WelcomeText darkMode={darkMode}>Bienvenido, {userName}!</WelcomeText>

          {/* Dark mode toggle button */}
          <button
            className="mt-4 bg-gray-300 p-2 rounded shadow-md flex items-center justify-center"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-3 md:space-y-20 mt-4 md:mt-5">
             {[
                   { icon: homeIcon, label: "Inicio", path: "/newhome" },
                   { icon: moduleIcon, label: "Granjas", path: "/farm" },
                   { icon: userIcon, label: "Usuarios", path: "/users" },
                   { icon: fishIcon, label: "Módulos", path: "/module" },
                   { icon: reportIcon, label: "Reporte", path: "/report" },
        ].map((item, index) => (
        <li
             key={index}
             className={`relative group flex items-center justify-center gap-3 p-2 cursor-pointer overflow-hidden rounded-lg ${
                  location.pathname === item.path
                  ? "bg-[#3cacac] text-white shadow-md"
                  : darkMode
                  ? "text-white group-hover:text-white"
                  : "text-gray-600 group-hover:text-black"
              }`}
             onClick={() => {
             handleNavigation(item.path);
           }}
          >
            <span
                  className={`absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-lg ${
                  location.pathname === item.path ? "bg-[#3cacac]" : "bg-[#3cacac]"
            }`}
             ></span>
               <span className="relative z-10 flex items-center gap-3 font-bold">
                   <img alt={item.label} className="h-6 w-6" src={item.icon} />
                   {item.label}
               </span>
           </li>
        ))}
       </ul>

          {/* Logout button */}
          <div className="mt-4 md:mt-10">
            <LogoutButtonStyled />
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main
        className={`flex-1 p-6 lg:ml-0 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
        }`}
      >
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-5 text-center">
          Acuaterra
        </h1>
        <p className="mb-7 text-base sm:text-sm text-center">
          Acuaterra es una herramienta de software diseñada para sistematizar el
          proceso de monitoreo en módulos acuapónicos.
        </p>

        {isMobile ? (
          <MobileCarousel />
        ) : (
          <>
            <Carousel slides={slides} />
            {stats && <DashboardStats farms={stats.farms} modules={stats.modules} />}
            {metrics && (
            <DashboardMetrics
              totalFarms={metrics.totalFarms}
              totalModules={metrics.totalModules}
              totalUsers={metrics.totalUsers}
            />
          )}
          </>
        )}
      </main>
    </div>
  );
};

export default NewHome;