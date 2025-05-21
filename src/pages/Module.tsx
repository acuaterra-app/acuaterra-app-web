/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { FunctionComponent } from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import Layout from "../components/layout/layout";
import LoaderAcua from "../components/loaders/LoaderAcua";
import TableWithActions from "../components/ui/table/tableWithActions";
import TableWithActionsMobile from "../components/ui/table/TableWithActionsMobile";
import useModulesByFarm from "../hooks/useModulesByFarm";
import useFarms from "../hooks/useFarms";
import { isTokenValid } from "../common/isTokenValid";
import { Menu, X } from "lucide-react";
import acuaterraLogo from "../assets/images/logo.png";
import homeIcon from "../assets/images/home.png";
import moduleIcon from "../assets/images/module.png";
import userIcon from "../assets/images/userlogo.png";
import reportIcon from "../assets/images/reporte.png";
import fishIcon from "../assets/images/pez.png";
import LogoutButton from "../components/ui/button/logoutButton";
import styled from "styled-components";
import SideBar from "../components/ui/sidebar/SideBar";


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
    transform: scale(1.05);
  }

  @keyframes text-rotation {
    to {
      rotate: 360deg;
    }
  }
`;

const sidebarItems = [
  { icon: homeIcon,   label: "Inicio",   path: "/newhome" },
  { icon: moduleIcon, label: "Granjas",  path: "/farm"    },
  { icon: userIcon,   label: "Usuarios", path: "/users"   },
  { icon: fishIcon,   label: "Módulos",  path: "/module"  },
  { icon: reportIcon, label: "Reporte",  path: "/report"  },
];

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

// Main component for the Module page
export const Module: FunctionComponent = () => {
  const navigate = useNavigate();

  // State variables
  const [isOpen, setIsOpen] = useState(false); // Sidebar toggle state
  const [isMobile, setIsMobile] = useState(false); // Mobile view state
  const [animateSidebar, setAnimateSidebar] = useState(false); // Sidebar animation state
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null); // Selected farm ID
  const [userName, setUserName] = useState<string>("Usuario"); // User name
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  // Hooks for fetching data
  const { modules, loading, error, total, page, perPage, setPage } =
    useModulesByFarm(selectedFarmId || 0);
  const { farms, loading: farmsLoading, error: farmsError } = useFarms();
  const menuRef = useRef<HTMLDivElement>(null);

  // Check token validity and set user name
  useEffect(() => {
    if (!isTokenValid()) {
      console.log("Redirecting to /auth from Module component");
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

  // Handle navigation to a new path
  const handleNavigation = (path: string): void => {
    void navigate({ to: path });
    setIsOpen(false);
  };

  return (
    <Layout>
      <div
        className={`flex min-h-screen font-sans relative ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        {/* Sidebar toggle button for mobile */}
        <button
        id="menu-button"
        className={`absolute top-4 left-4 z-50 p-2 rounded shadow-md md:hidden transition-colors ${
          darkMode
            ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
            : "bg-[#d3d3d3] text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => {
          setIsOpen(!isOpen);
         }}
       >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

        {/* Sidebar */}
        <SideBar
          LogoutButtonStyled={<LogoutButtonStyled />}
          acuaterraLogo={acuaterraLogo}
          animateSidebar={animateSidebar}
          darkMode={darkMode}
          handleNavigation={handleNavigation}
          isMobile={isMobile}
          isOpen={isOpen}
          items={sidebarItems}
          location={{ pathname: location.pathname }}
          menuRef={menuRef}
          setIsOpen={setIsOpen}
          toggleDarkMode={toggleDarkMode}
          userName={userName}
        />
        
        {/* Main Content */}
        <main
          className={`flex-1 p-6 lg:ml-64 max-w-full overflow-x-auto ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
          }`}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 text-center">
            Lista de Módulos
          </h1>

          {/* Farm's Selector */}
         <div className="mb-6 max-w-md mx-auto">
             <label className="block text-center text-2xl font-bold mb-4">
               Seleccione una Granja
             </label>
             <select
               disabled={farmsLoading}
               className={`w-full rounded px-3 py-2 focus:outline-none transition-colors
                 ${darkMode
                   ? "bg-gray-800 border border-gray-600 text-white placeholder-gray-400"
                   : "bg-white border border-gray-300 text-black"
                 }`}
               onChange={(event) => {
                 setSelectedFarmId(Number(event.target.value));
               }}
             >
               <option value="">Seleccione una granja</option>
               {farms.map((farm) => (
                 <option key={farm.id} value={farm.id}>
                   {farm.name}
                 </option>
               ))}
             </select>
             {farmsError && (
               <p className="text-red-500 mt-2 text-center">
                 Error al cargar las granjas
               </p>
             )}
        </div>

          {loading ? (
            <LoaderAcua darkMode={darkMode} />
          ) : (
            <>
              {error && <p className="mt-4 text-red-500">Error: {error}</p>}

             <div
              className={`hidden md:block rounded-lg p-4 shadow-md w-full max-w-7xl mx-auto animate-wipe-in-right border transition-colors duration-300 ${
                darkMode
                   ? "bg-gray-800 border-gray-700 text-gray-100"
                   : "bg-white border-gray-300 text-black"
                }`}
               >
                <TableWithActions
                    darkMode={darkMode}
                    data={modules}
                    error={error}
                    isVisibleActions={false}
                    isVisibleButton={false}
                    limit={perPage}
                    loading={loading}
                    page={page}
                    setLimit={() => {} }
                    setPage={setPage}
                    total={total}
                    columns={[
                      { header: "ID", accessor: "id" },
                      { header: "Nombre", accessor: "name" },
                      { header: "Ubicación", accessor: "location" },
                      {
                        header: "Especie de Pescados",
                        accessor: "species_fish",
                      },
                      { header: "Cantidad", accessor: "fish_quantity" },
                      { header: "Dimensiones", accessor: "dimensions" },
                      {
                        header: "Creado Por",
                        accessor: "creator",
                        render: (module) => module.creator.name.toString(),
                      },
                      {
                        header: "Granja",
                        accessor: "farm",
                        render: (module) => module.farm.name.toString(),
                      },
                    ]} onAdd={function (): void {
                      throw new Error("Function not implemented.");
                    } } onDelete={function (): void {
                      throw new Error("Function not implemented.");
                    } } onEdit={function (): void {
                      throw new Error("Function not implemented.");
                    } }                />
              </div>

             <div
                 className={`block md:hidden rounded-lg p-4 shadow-md w-full max-w-sm mx-auto transition-colors border ${
                   darkMode
                     ? "bg-gray-800 border-gray-700 text-gray-100"
                     : "bg-white border-gray-300 text-black"
                 }`}
                 >
                 <TableWithActionsMobile
                   darkMode={darkMode}
                   data={modules}
                   error={error}
                   isVisibleActions={false}
                   isVisibleButton={false}
                   limit={perPage}
                   loading={loading}
                   page={page}
                   setLimit={() => {}}
                   setPage={setPage}
                   total={total}
                   columns={[
                     { header: "ID", accessor: "id" },
                     { header: "Nombre", accessor: "name" },
                     { header: "Ubicación", accessor: "location" },
                     { header: "Especie de Pescados", accessor: "species_fish" },
                     { header: "Cantidad", accessor: "fish_quantity" },
                     { header: "Dimensiones", accessor: "dimensions" },
                     {
                       header: "Creado Por",
                       accessor: "creator",
                       render: (module) => module.creator.name.toString(),
                     },
                     {
                       header: "Granja",
                       accessor: "farm",
                       render: (module) => module.farm.name.toString(),
                     },
                   ]}
                   onAdd={function (): void {
                     throw new Error("Function not implemented.");
                   }}
                   onDelete={function (): void {
                     throw new Error("Function not implemented.");
                   }}
                   onEdit={function (): void {
                     throw new Error("Function not implemented.");
                   }}
                 />
            </div>
          </>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Module;