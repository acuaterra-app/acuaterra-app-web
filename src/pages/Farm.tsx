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
import { Menu, X, Sun, Moon } from "lucide-react";
import styled from "styled-components";
import { isTokenValid } from "../common/isTokenValid";

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
  color: ${(props: { darkMode: boolean }) => (props.darkMode ? "white" : "#4a4a4a")};
  margin-top: 0.5rem;
  text-align: center;
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
        className="fixed top-4 left-4 z-50 bg-gray-300 p-2 rounded shadow-md md:hidden"
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
         className={`fixed top-0 left-0 w-64 h-screen
         ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-[#e0e0e0] text-gray-600 border-gray-400"}
         border-r flex flex-col transform transition-transform duration-300 ease-in-out z-50 shadow-lg
         ${isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"}
         ${animateSidebar ? "animate-slide-in" : ""}
          `}
          style={{
             height: "100vh",
             boxShadow: "5px 0 15px rgba(0, 0, 0, 0.2)",
           }}
       >
        <div className="p-4 flex flex-col items-center relative">
          <button
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200 lg:hidden"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <X size={24} />
          </button>

          <SidebarLogoWrapper>
            <img alt="Acuaterra Logo" className="logo mb-2" src={acuaterraLogo} />
          </SidebarLogoWrapper>
          <WelcomeText darkMode={darkMode}>Bienvenido, {userName}!</WelcomeText>

          {/* Dark mode toggle button */}
          <button
             className={`mt-4 p-2 rounded shadow-md flex items-center justify-center transition-colors ${
               darkMode
                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-3 md:space-y-20 mt-4 md:mt-5">
            {[
              { icon: homeIcon,   label: "Inicio",   path: "/newhome" },
              { icon: moduleIcon, label: "Granjas",  path: "/farm" },
              { icon: userIcon,   label: "Usuarios", path: "/users" },
              { icon: fishIcon,   label: "Módulos",  path: "/module" },
              { icon: reportIcon, label: "Reporte",  path: "/report" },
            ].map((item, index) => (
              <li
                key={index}
                className={`relative group flex items-center justify-center gap-3 p-2 cursor-pointer overflow-hidden rounded-lg ${
                  location.pathname === item.path
                    ? "bg-[#3cacac] text-white shadow-md"
                    : darkMode
                    ? "text-white group-hover:text-white"
                    : "text-gray-600 group-hover:text-gray-800"
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
             darkMode={darkMode} // <-- Cambia esto a darkMode
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