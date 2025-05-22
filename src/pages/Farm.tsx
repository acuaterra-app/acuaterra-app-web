/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-duplicate-imports
import type { FunctionComponent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFarms from "../hooks/useFarms";
import TableWithActions from "../components/ui/table/tableWithActions";
import TableWithActionsMobile from "../components/ui/table/TableWithActionsMobile";
import FarmModal from "../components/ui/modals/FarmModal";
import type { FarmRequest, User } from "../common/types";
import LogoutButton from "../components/ui/button/logoutButton";
import acuaterraLogo from "../assets/images/logo.png";
import reportIcon from "../assets/images/reporte.png";
import homeIcon from "../assets/images/home.png";
import moduleIcon from "../assets/images/module.png";
import userIcon from "../assets/images/userlogo.png";
import fishIcon from "../assets/images/pez.png";
import LoaderAcua from "../components/loaders/LoaderAcua";
import { Menu, X, } from "lucide-react";
import styled from "styled-components";
import { isTokenValid } from "../common/isTokenValid";
import SideBar from "../components/ui/sidebar/SideBar";

const sidebarItems = [
  { icon: homeIcon,   label: "Inicio",   path: "/newhome" },
  { icon: moduleIcon, label: "Granjas",  path: "/farm"    },
  { icon: userIcon,   label: "Usuarios", path: "/users"   },
  { icon: fishIcon,   label: "Módulos",  path: "/module"  },
  { icon: reportIcon, label: "Reporte",  path: "/report"  },
];
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

const FarmsPage: FunctionComponent = () => {
  const {
    farms,
    loading,
    error,
    total,
    page,
    limit,
    setPage,
    setLimit,
    addFarm,
    editFarm,
    removeFarm,
  } = useFarms();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<FarmRequest | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [animateSidebar, setAnimateSidebar] = useState(false);
  const [userName, setUserName] = useState<string>("Usuario");
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Check token validity and set user name
  useEffect(() => {
    if (!isTokenValid()) {
      console.log("Redirigiendo a /auth desde el componente Farms");
      void navigate({ to: "/auth" });
    } else {
      const name = localStorage.getItem("userName");
      console.log("Nombre del usuario obtenido desde localStorage:", name);
      setUserName(name || "Usuario");
    }
  }, [navigate]);

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

  const handleAddFarm = async (farmData: FarmRequest): Promise<void> => {
    try {
      const isRegister = await addFarm(farmData);
      setIsModalOpen(false);
      if (isRegister) {
        toast.success("Granja agregada exitosamente!");
      } else {
        toast.error("No se pudo agregar la granja. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      toast.error("No se pudo agregar la granja. Por favor, inténtalo de nuevo.");
      console.error("Error al agregar la granja:", error);
    }
  };

  const handleEditFarm = async (farmData: FarmRequest): Promise<void> => {
    try {
      if (selectedFarm) {
        const userIds = farmData.users.map((user) =>
          typeof user === "object" ? user.id : user
        );
        const updatedFarmData = { ...farmData, users: userIds };
        await editFarm(selectedFarm.id as number, updatedFarmData);
      }
      setIsModalOpen(false);
      toast.success("Granja editada exitosamente!");
    } catch (error) {
      console.error("Error al editar la granja:", error);
      toast.error("No se pudo editar la granja. Por favor, inténtalo de nuevo.");
    }
  };

  const handleRemoveFarm = async (farmId: number): Promise<void> => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta granja?"
    );
    if (confirmed) {
      await removeFarm(farmId);
      toast.success("Granja eliminada exitosamente!");
    }
  };

  const handleNavigation = (path: string): void => {
    void navigate({ to: path });
    setIsOpen(false);
  };

  return (
    <div
      className={`flex min-h-screen font-sans relative overflow-x-auto ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <ToastContainer />

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
          acuaterraLogo   ={acuaterraLogo}
          animateSidebar  ={animateSidebar}
          darkMode        ={darkMode}
          handleNavigation={handleNavigation}
          isMobile        ={isMobile}
          isOpen          ={isOpen}
          items           ={sidebarItems}
          location        ={{ pathname: location.pathname }}
          menuRef         ={menuRef}
          setIsOpen       ={setIsOpen}
          toggleDarkMode  ={toggleDarkMode}
          userName        ={userName}
        />

      {/* Main content */}
      <main
        className={`flex-1 p-6 lg:ml-64 max-w-full overflow-x-auto ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
        }`}
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 text-center">
          Granjas
        </h1>
        <p className="text-gray-500 mb-6 text-lg sm:text-sm text-center">
          Aquí puedes gestionar las granjas acuapónicas.
        </p>

        {loading ? (
          <LoaderAcua darkMode={darkMode} />
        ) : (
          <>
            {/* Desktop table */}
            <div
              className={`hidden md:block rounded-lg p-4 shadow-md w-full max-w-7xl mx-auto animate-wipe-in-right border transition-colors duration-300 ${
                darkMode
                   ? "bg-gray-800 border-gray-700 text-gray-100"
                   : "bg-white border-gray-300 text-black"
                }`}
               >   
              
              <TableWithActions
                darkMode={darkMode}
                data={farms}
                error={error}
                limit={limit}
                loading={loading}
                page={page}
                setLimit={setLimit}
                setPage={setPage}
                total={total}
                columns={[
                  { header: "ID",        accessor: "id" },
                  { header: "Name",      accessor: "name" },
                  { header: "Latitud",   accessor: "latitude" },
                  { header: "Longitud",  accessor: "longitude" },
                  { header: "Dirección", accessor: "address" },
                  { header: "Date",      accessor: "createdAt" },
                  {
                    header: "Users",
                    accessor: "users",
                    render: (farm) =>
                      farm.users.map((user) => (user as User).name).join(", "),
                  },
                ]}
                
                onDelete={handleRemoveFarm}
                onAdd={() => {
                  setSelectedFarm(null);
                  setIsModalOpen(true);
                }}
                onEdit={(farm: FarmRequest) => {
                  setSelectedFarm(farm);
                  setIsModalOpen(true);
                }}
                
              />
            </div>

            {/* Mobile table */}
            <div
              className={`block md:hidden rounded-lg p-4 shadow-md w-full max-w-sm mx-auto border transition-colors duration-300 ${
                 darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-100"
                    : "bg-white border-gray-300 text-black"
                }`}   
                >   

              <TableWithActionsMobile
                darkMode={darkMode}
                data={farms}
                error={error}
                limit={limit}
                loading={loading}
                page={page}
                setLimit={setLimit}
                setPage={setPage}
                total={total}
                columns={[
                  { header: "ID",        accessor: "id" },
                  { header: "Name",      accessor: "name" },
                  { header: "Latitud",   accessor: "latitude" },
                  { header: "Longitud",  accessor: "longitude" },
                  { header: "Dirección", accessor: "address" },
                  { header: "Date",      accessor: "createdAt" },
                  {
                    header: "Users",
                    accessor: "users",
                    render: (farm) =>
                      farm.users.map((user) => (user as User).name).join(", "),
                  },
                ]}
                onDelete={handleRemoveFarm}
                onAdd={() => {
                  setSelectedFarm(null);
                  setIsModalOpen(true);
                }}
                onEdit={(farm: FarmRequest) => {
                  setSelectedFarm(farm);
                  setIsModalOpen(true);
                }}
                
              />
            </div>
          </>
        )}

       {isModalOpen && (
         <FarmModal
             darkMode={darkMode} 
             farm={selectedFarm}
             onSave={selectedFarm ? handleEditFarm : handleAddFarm}
             onClose={() => {
           setIsModalOpen(false);
           }}
          />
     )}
      </main>
    </div>
  );
};

export default FarmsPage;