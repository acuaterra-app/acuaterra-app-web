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
import { fetchAllFarms } from "../services/farmSevice";
import type { Farm } from "../common/types";
import { isTokenValid } from "../common/isTokenValid";
import HamburgerMenuButton from "../components/ui/button/HamburgerMenuButton";
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
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // NUEVO
  const [allFarms, setAllFarms] = useState<Array<Farm>>([]); // Todas las granjas para selector
  const [allFarmsLoading, setAllFarmsLoading] = useState(false); // Loading de todas las granjas
  const [allFarmsError, setAllFarmsError] = useState<string | null>(null); // Error al cargar granjas

  // Hooks for fetching data
  const { modules, loading, error, total, page, perPage, setPage } =
    useModulesByFarm(selectedFarmId || 0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check token validity and set user name
  useEffect(() => {
    if (!isTokenValid()) {
      void navigate({ to: "/auth" });
    } else {
      const name = localStorage.getItem("userName");
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

  // Cargar todas las granjas para el selector al inicializar el componente
  useEffect(() => {
    const loadAllFarms = async (): Promise<void> => {
      setAllFarmsLoading(true);
      setAllFarmsError(null);
      try {
        const response = await fetchAllFarms();
        setAllFarms(response.data);
      } catch (error) {
        console.error('Error loading all farms:', error);
        setAllFarmsError('Error al cargar las granjas');
      } finally {
        setAllFarmsLoading(false);
      }
    };

    void loadAllFarms();
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

  const sidebarWidth = isMobile ? undefined : (sidebarExpanded ? "16rem" : "4.5rem");

  return (
    <Layout>
      <div
        className={`flex min-h-screen font-sans relative ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        {/* Sidebar toggle button for mobile */}
        <HamburgerMenuButton
          darkMode={darkMode}
          isOpen={isOpen}
          onClick={() => { setIsOpen(!isOpen); }}
        />

        {/* Sidebar */}
        <SideBar
          LogoutButtonStyled     ={<LogoutButtonStyled />}
          acuaterraLogo          ={acuaterraLogo}
          animateSidebar         ={animateSidebar}
          darkMode               ={darkMode}
          handleNavigation       ={handleNavigation}
          isMobile               ={isMobile}
          isOpen                 ={isOpen}
          items                  ={sidebarItems}
          location               ={{ pathname: window.location.pathname }}
          menuRef                ={menuRef}
          setIsOpen              ={setIsOpen}
          toggleDarkMode         ={toggleDarkMode}
          userName               ={userName}
          onSidebarExpandChange  ={setSidebarExpanded} 
        />
        
        {/* Main Content */}
        <main
          className={`flex-1 p-6 max-w-full overflow-x-auto ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
          }`}
          style={{
            marginLeft: isMobile ? undefined : sidebarWidth, 
            background: darkMode ? "#111827" : "#fff",      
            transition: "margin-left 0.5s cubic-bezier(.4,0,.2,1), background 0.3s cubic-bezier(.4,0,.2,1)",
          }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 text-center">
            Lista de Módulos
          </h1>

          {/* Farm's Selector - Mejorado para mostrar todas las granjas */}
          <div className="mb-8 max-w-md mx-auto">
            <label className="block text-center text-2xl font-bold mb-4 text-blue-600">
              🏠 Seleccione una Granja
            </label>
            <select
              disabled={allFarmsLoading}
              value={selectedFarmId || ""}
              className={`w-full rounded-lg px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-lg border-2
                ${allFarmsLoading 
                  ? "opacity-50 cursor-not-allowed" 
                  : "cursor-pointer hover:shadow-xl"
                }
                ${darkMode
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
                }`}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedFarmId(value ? Number(value) : null);
              }}
            >
              <option disabled value="">
                {allFarmsLoading ? "🔄 Cargando granjas..." : "Seleccione una granja"}
              </option>
              {allFarms.map((farm: Farm) => (
                <option key={farm.id} value={farm.id}>
                  🌊 {farm.name}
                </option>
              ))}
            </select>
            
            {/* Mensajes de estado */}
            {allFarmsError && (
              <p className="text-red-500 mt-2 text-center">
                ⚠️ {allFarmsError}
              </p>
            )}
            
            {!allFarmsLoading && allFarms.length === 0 && !allFarmsError && (
              <p className="text-yellow-600 mt-2 text-center">
                📭 No hay granjas disponibles
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
                  darkMode         ={darkMode}
                  data             ={modules}
                  error            ={error}
                  isVisibleActions ={false}
                  isVisibleButton  ={false}
                  limit            ={perPage}
                  loading          ={loading}
                  page             ={page}
                  setLimit         ={() => {}}
                  setPage          ={setPage}
                  total            ={total}
                  columns          ={[
                    { header: "ID",        accessor: "id"       },
                    { header: "Nombre",    accessor: "name"     },
                    { header: "Ubicación", accessor: "location" },
                    {
                      header:   "Especie de Pescados",
                      accessor: "species_fish",
                    },
                    { header: "Cantidad",    accessor: "fish_quantity" },
                    { header: "Dimensiones", accessor: "dimensions"    },
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

              <div
                className={`block md:hidden rounded-lg p-4 shadow-md w-full max-w-sm mx-auto transition-colors border ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-100"
                    : "bg-white border-gray-300 text-black"
                }`}
              >
                <TableWithActionsMobile
                  darkMode         ={darkMode}
                  data             ={modules}
                  error            ={error}
                  isVisibleActions ={false}
                  isVisibleButton  ={false}
                  limit            ={perPage}
                  loading          ={loading}
                  page             ={page}
                  setLimit         ={() => {}}
                  setPage          ={setPage}
                  total            ={total}
                  columns          ={[
                    { header: "ID", accessor:                  "id"            },
                    { header: "Nombre", accessor:              "name"          },
                    { header: "Ubicación", accessor:           "location"      },
                    { header: "Especie de Pescados", accessor: "species_fish"  },
                    { header: "Cantidad", accessor:            "fish_quantity" },
                    { header: "Dimensiones", accessor:         "dimensions"    },
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