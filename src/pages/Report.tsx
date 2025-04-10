import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-duplicate-imports
import type { FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import acuaterraLogo from "../assets/images/logo.png";
import homeIcon from "../assets/images/home.png";
import reporteIcon from "../assets/images/reporte.png";
import moduleIcon from "../assets/images/module.png";
import userIcon from "../assets/images/userlogo.png";
import fishIcon from "../assets/images/pez.png";
import LoaderAcua from "../components/loaders/LoaderAcua";
import LogoutButton from "../components/ui/button/logoutButton";
import { isTokenValid } from "../common/isTokenValid";
import SensorChart from "../components/charts/line/SensorChart";
import styled from "styled-components";

const SidebarLogoWrapper = styled.div`
  .logo {
    width: 96px;
    height: 96px;
    transition: transform 0.3s ease;
  }

  .logo:hover {
    transform: scale(1.1);
  }
`;

const WelcomeText = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #4a4a4a;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
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

const Report: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const sensorLabels = ["10:00", "10:05", "10:10", "10:15", "10:20"];
  const sensorData = [20, 25, 22, 30, 28];
  const weeklyLabels = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const weeklyData = [25, 28, 22, 30, 26, 24, 27];

  const monthlyLabels = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const monthlyData = [22, 24, 26, 28, 30, 32, 34, 33, 31, 29, 27, 25];

  useEffect(() => {
    if (!isTokenValid()) {
      console.log("Redirigiendo a /auth desde el componente Report");
      void navigate({ to: "/auth" });
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => {
      clearTimeout(timer);
    };
  }, []);

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

  const handleNavigation = (path: string): void => {
    void navigate({ to: path });
    setIsOpen(false);
  };

  return (
    <div className="flex h-screen bg-white font-sans">
      {/* Close and open buttom for side bar */}
      <button
        className="absolute top-4 left-4 z-50 bg-gray-300 p-2 rounded shadow-md md:hidden"
        id="menu-button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Side bar*/}
      <aside
        ref={menuRef}
        id="sidebar"
        className={`fixed top-0 left-0 w-64 h-screen bg-[#e0e0e0] border-r border-gray-400 flex flex-col transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64`}
        style={{
          height: "100vh",
          boxShadow: "7px 0 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="p-4 flex flex-col items-center relative">
          <button
            className="absolute top-2 right-2 p-2 text-gray-700 hover:text-gray-900 md:hidden"
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

    <nav className="flex-1 overflow-y-auto">
         <ul className="space-y-3 md:space-y-20 mt-4 md:mt-20">
           {[
             { icon: homeIcon, label: "Inicio", path: "/newhome" },
             { icon: moduleIcon, label: "Granjas", path: "/farm" },
             { icon: userIcon, label: "Usuarios", path: "/users" },
             { icon: fishIcon, label: "Módulos", path: "/module" },
             { icon: reporteIcon, label: "Reporte", path: "/report" }, // Asegúrate de que el path sea único
           ].map((item, index) => (
      <li
             key={index}
             className={`relative group flex items-center justify-center gap-3 p-2 cursor-pointer overflow-hidden rounded-lg ${
               location.pathname === item.path
                ? "bg-[#3cacac] text-white shadow-md"
                : "text-gray-600 group-hover:text-white"
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

        <div className="mt-4 md:mt-20">
          <LogoutButtonStyled />
        </div>
    </nav>
      </aside>

      {/* Main Content*/}
    <main
        className={`flex-1 p-6 bg-white overflow-y-auto ${
          isOpen ? "" : "md:ml-64"
        }`}
       >
          {loading ? (
           <LoaderAcua />
         ) : (
       <>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 text-center text-gray-700">
            Reportes
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Visualización y generación de reportes.
          </p>

          {/* Graphs */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
             Comportamiento en Tiempo Real
            </h2>
            <SensorChart
              color="rgba(75, 192, 192, 1)"
              data={sensorData}
              labels={sensorLabels}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Comportamiento Semanal
            </h2>
            <SensorChart
              color="rgba(255, 99, 132, 1)"
              data={weeklyData}
              labels={weeklyLabels}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Comportamiento Mensual
            </h2>
            <SensorChart
              color="rgba(54, 162, 235, 1)"
              data={monthlyData}
             labels={monthlyLabels}
            />
          </div>
        </>
      )}
    </main>
</div>
);
};

export default Report;