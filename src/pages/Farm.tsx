/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-duplicate-imports
import type { FunctionComponent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFarms from "../hooks/useFarms";
import useDebounce from "../hooks/useDebounce";
import TableWithActions from "../components/ui/table/tableWithActions";
import TableWithActionsMobile from "../components/ui/table/TableWithActionsMobile";
import FarmModal from "../components/ui/modals/FarmModal";
import type { FarmRequest, User, Farm } from "../common/types";
import LogoutButton from "../components/ui/button/logoutButton";
import acuaterraLogo from "../assets/images/logo.png";
import reportIcon from "../assets/images/reporte.png";
import homeIcon from "../assets/images/home.png";
import moduleIcon from "../assets/images/module.png";
import userIcon from "../assets/images/userlogo.png";
import fishIcon from "../assets/images/pez.png";
import LoaderAcua from "../components/loaders/LoaderAcua";
import HamburgerMenuButton from "../components/ui/button/HamburgerMenuButton";
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
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [globalSearchTerm, setGlobalSearchTerm] = useState(''); // Término de búsqueda global
  const [allFarms, setAllFarms] = useState<Array<Farm>>([]); // Todos los datos para búsqueda
  const [isSearchMode, setIsSearchMode] = useState(false); // Indica si estamos en modo búsqueda
  const [searchResults, setSearchResults] = useState<Array<Farm>>([]); // Resultados de búsqueda
  
  // Estados adicionales para debug y control de búsqueda
  const [isLoadingAllData, setIsLoadingAllData] = useState(false);
  
  // Debounce el término de búsqueda para mejorar la experiencia
  const debouncedSearchTerm = useDebounce(globalSearchTerm, 300);
  
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTokenValid()) {
      void navigate({ to: "/auth" });
    } else {
      const name = localStorage.getItem("userName");
      setUserName(name || "Usuario");
    }
  }, [navigate]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.body.classList.toggle("dark-mode", savedDarkMode);
  }, []);

  // Efecto para cargar todos los datos para búsqueda completa (CORREGIDO)
  useEffect(() => {
    const loadAllFarms = async (): Promise<void> => {
      const shouldActivateSearch = debouncedSearchTerm && debouncedSearchTerm.trim() !== '';
      
      if (shouldActivateSearch && !isSearchMode) {
        console.log('🔍 ACTIVANDO búsqueda global para:', debouncedSearchTerm);
        setIsLoadingAllData(true);
        setIsSearchMode(true);
        
        try {
          // Cargar TODOS los datos usando paginación múltiple (límite máximo: 100)
          const { fetchFarms } = await import('../services/farmSevice');
          let allData: Array<Farm> = [];
          let currentPage = 1;
          let hasMoreData = true;
          const maxLimit = 100; // Límite máximo permitido por el API
          
         
          while (hasMoreData) {
            console.log(`📄 Cargando página ${currentPage} con límite ${maxLimit}`);
            
            // eslint-disable-next-line no-await-in-loop
            const response = await fetchFarms(currentPage, maxLimit);
            
            if (response.data.length > 0) {
              allData = [...allData, ...response.data];
              console.log(`📊 Página ${currentPage}: ${response.data.length} granjas (Total acumulado: ${allData.length})`);
              
              // Si obtuvimos menos datos del límite, ya no hay más páginas
              if (response.data.length < maxLimit) {
                hasMoreData = false;
              } else {
                currentPage++;
              }
            } else {
              hasMoreData = false;
            }
          }
          
          console.log(`✅ DATOS CARGADOS para búsqueda: ${allData.length} granjas totales`);
          setAllFarms(allData);
        } catch (error) {
          console.error('❌ ERROR cargando datos para búsqueda:', error);
          // Fallback: usar datos actuales
          setAllFarms(farms);
        } finally {
          setIsLoadingAllData(false);
        }
      } 
      else if (!shouldActivateSearch && isSearchMode) {
        console.log('🔄 DESACTIVANDO búsqueda global');
        setIsSearchMode(false);
        setAllFarms([]);
        setSearchResults([]);
        setIsLoadingAllData(false);
      }
    };

    void loadAllFarms();
  }, [debouncedSearchTerm, isSearchMode, farms]);

  // Efecto para realizar búsqueda GLOBAL (REFACTORIZADO)
  useEffect(() => {
    const performGlobalSearch = (): void => {
      if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '' && isSearchMode && allFarms.length > 0) {
        console.log('🔎 EJECUTANDO búsqueda global:', {
          termino: debouncedSearchTerm,
          totalGranjas: allFarms.length,
          modoActivo: isSearchMode
        });
        
        const searchLower = debouncedSearchTerm.toLowerCase();
        const results = allFarms.filter((farm) => {
          // Búsqueda exhaustiva en todos los campos
          const matchName = farm.name.toLowerCase().includes(searchLower);
          const matchAddress = farm.address.toLowerCase().includes(searchLower);
          const matchLat = farm.latitude.toString().toLowerCase().includes(searchLower);
          const matchLng = farm.longitude.toString().toLowerCase().includes(searchLower);
          const matchUsers = farm.users.some((user) => {
            const u = user as User;
            return u.name.toLowerCase().includes(searchLower) || 
                   u.email.toLowerCase().includes(searchLower);
          });
          
          const isMatch = matchName || matchAddress || matchLat || matchLng || matchUsers;
          if (isMatch) {
            console.log('✅ ENCONTRADO:', farm.name, 'en búsqueda de:', debouncedSearchTerm);
          }
          return isMatch;
        });
        
        console.log('📋 RESULTADOS:', results.length, 'de', allFarms.length, 'granjas');
        setSearchResults(results);
      } 
      else if (!debouncedSearchTerm || debouncedSearchTerm.trim() === '') {
        console.log('🧹 LIMPIANDO resultados de búsqueda');
        setSearchResults([]);
      }
    };

    performGlobalSearch();
  }, [debouncedSearchTerm, allFarms, isSearchMode]);

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

  // Función para manejar búsqueda global (MEJORADA)
  const handleGlobalSearch = (searchTerm: string): void => {
    console.log('🎯 HANDLEGLOBLALSEARCH recibió:', searchTerm);
    setGlobalSearchTerm(searchTerm);
    // NO forzamos regresar a la página 1 - búsqueda desde cualquier página
    // La búsqueda se realizará sobre TODOS los datos de la tabla
  };

  // Determinar qué datos mostrar (REFACTORIZADO con logs detallados)
  const isInSearchMode = isSearchMode && debouncedSearchTerm && debouncedSearchTerm.trim() !== '';
  const displayData = isInSearchMode ? searchResults : farms;
  const displayTotal = isInSearchMode ? searchResults.length : total;
  
  // Debug detallado
  console.log('🐛 ESTADO BÚSQUEDA:', {
    globalSearchTerm,
    debouncedSearchTerm,
    isSearchMode,
    isInSearchMode,
    allFarmsCount: allFarms.length,
    searchResultsCount: searchResults.length,
    farmsCount: farms.length,
    displayDataCount: displayData.length,
    displayTotal,
    currentPage: page
  });

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

  // Callbacks para las tablas
  const handleAddNewFarm = (): void => {
    setSelectedFarm(null);
    setIsModalOpen(true);
  };

  const handleEditFarmFromTable = (farm: FarmRequest): void => {
    setSelectedFarm(farm);
    setIsModalOpen(true);
  };

  const sidebarWidth = isMobile ? undefined : (sidebarExpanded ? "16rem" : "4.5rem");

  return (
    <div
      className={`flex min-h-screen font-sans relative overflow-x-auto ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <ToastContainer />

      {/* Sidebar toggle button for mobile */}
      <HamburgerMenuButton
        darkMode={darkMode}
        isOpen={isOpen}
        onClick={() => { setIsOpen(!isOpen); }}
      />

      {/* Sidebar */}
      <SideBar
        LogoutButtonStyled   ={<LogoutButtonStyled />}
        acuaterraLogo        ={acuaterraLogo}
        animateSidebar       ={animateSidebar}
        darkMode             ={darkMode}
        handleNavigation     ={handleNavigation}
        isMobile             ={isMobile}
        isOpen               ={isOpen}
        items                ={sidebarItems}
        location             ={{ pathname: location.pathname }}
        menuRef              ={menuRef}
        setIsOpen            ={setIsOpen}
        toggleDarkMode       ={toggleDarkMode}
        userName             ={userName}
        onSidebarExpandChange={setSidebarExpanded} 
      />

      {/* Main content */}
      <main
        className={`
          flex-1 p-6 max-w-full overflow-x-auto
          transition-all duration-300
          ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"}
        `}
        style={{
          marginLeft: isMobile ? undefined : sidebarWidth, 
          background: darkMode ? "#111827" : "#fff",      
          transition: "margin-left 0.5s cubic-bezier(.4,0,.2,1), background 0.3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 text-center">
          Granjas
        </h1>
        <p className="text-gray-500 mb-6 text-lg sm:text-sm text-center">
          Aquí puedes gestionar las granjas acuapónicas.
        </p>

        {/* Indicador de búsqueda global mejorado */}
        {isInSearchMode && (
          <div className={`mb-4 p-3 rounded-lg border text-center ${
            darkMode 
              ? "bg-blue-900 border-blue-700 text-blue-100" 
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}>
            <p className="text-sm">
              🔍 <strong>Búsqueda global activa:</strong> "{debouncedSearchTerm}" 
              {isLoadingAllData ? (
                <span className="ml-2">⏳ Cargando datos...</span>
              ) : (
                <>
                  - {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''} 
                  en toda la tabla ({allFarms.length} granjas totales)
                </>
              )}
            </p>
          </div>
        )}

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
                data={displayData}
                error={error}
                limit={limit}
                loading={loading}
                page={page}
                searchPlaceholder="🔍 Buscar granjas por nombre, dirección o usuarios..."
                searchTerm={globalSearchTerm}
                setLimit={setLimit}
                setPage={setPage}
                total={displayTotal}
                columns={[
                  { header: "ID",        accessor: "id"        },
                  { header: "Name",      accessor: "name"      },
                  { header: "Latitud",   accessor: "latitude"  },
                  { header: "Longitud",  accessor: "longitude" },
                  { header: "Dirección", accessor: "address"   },
                  { header: "Date",      accessor: "createdAt" },
                  {
                    header: "Users",
                    accessor: "users",
                    render: (farm) => {
                      console.log('🔧 RENDER farm:', farm.name, 'para búsqueda:', globalSearchTerm);
                      return farm.users.map((user) => (user as User).name).join(", ");
                    },
                  },
                ]}
                onAdd={handleAddNewFarm}
                onDelete={handleRemoveFarm}
                onEdit={handleEditFarmFromTable}
                onGlobalSearch={handleGlobalSearch}
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
                data={displayData}
                error={error}
                limit={limit}
                loading={loading}
                page={page}
                searchPlaceholder="🔍 Buscar granjas..."
                searchTerm={globalSearchTerm}
                setLimit={setLimit}
                setPage={setPage}
                total={displayTotal}
                columns={[
                  { header: "ID",        accessor: "id"        },
                  { header: "Name",      accessor: "name"      },
                  { header: "Latitud",   accessor: "latitude"  },
                  { header: "Longitud",  accessor: "longitude" },
                  { header: "Dirección", accessor: "address"   },
                  { header: "Date",      accessor: "createdAt" },
                  {
                    header: "Users",
                    accessor: "users",
                    render: (farm) =>
                      farm.users.map((user) => (user as User).name).join(", "),
                  },
                ]}
                onAdd={handleAddNewFarm}
                onDelete={handleRemoveFarm}
                onEdit={handleEditFarmFromTable}
                onGlobalSearch={handleGlobalSearch}
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