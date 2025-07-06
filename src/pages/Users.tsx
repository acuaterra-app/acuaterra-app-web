/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-duplicate-imports
import type { FunctionComponent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { UserRequestV2, UserResponse } from "../common/types";
import useUsers from "../hooks/useUsers";
import useDebounce from "../hooks/useDebounce";
import RegisterUserModal from "../components/ui/modals/registerUserModal";
import UpdateUserModal from "../components/ui/modals/updateUserModalProps";
import useRegisterUser from "../hooks/useRegisterUser";
import { deleteUser, updateUser, fetchAllUsers } from "../services/userService";
import TableWithActions from "../components/ui/table/tableWithActions";
import TableWithActionsMobile from "../components/ui/table/TableWithActionsMobile";
import LoaderAcua from "../components/loaders/LoaderAcua";
import userIcon from "../assets/images/userlogo.png";
import moduleIcon from "../assets/images/module.png";
import homeIcon from "../assets/images/home.png";
import acuaterraLogo from "../assets/images/logo.png";
import reportIcon from "../assets/images/reporte.png";
import fishIcon from "../assets/images/pez.png";
import HamburgerMenuButton from "../components/ui/button/HamburgerMenuButton";
import LogoutButton from "../components/ui/button/logoutButton";
import styled from "styled-components";
import { isTokenValid } from "../common/isTokenValid";
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

const sidebarItems = [
  { icon: homeIcon,   label: "Inicio",   path: "/newhome" },
  { icon: moduleIcon, label: "Granjas",  path: "/farm"    },
  { icon: userIcon,   label: "Usuarios", path: "/users"   },
  { icon: fishIcon,   label: "Módulos",  path: "/module"  },
  { icon: reportIcon, label: "Reporte",  path: "/report"  },
];

export const Users: FunctionComponent = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("Usuario");
  const [reload, setReload] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const { users, page, setPage, loading, limit, error, total, setLimit } =
    useUsers(reload);
  const { registerUser } = useRegisterUser();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [animateSidebar, setAnimateSidebar] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true); 
  const [globalSearchTerm, setGlobalSearchTerm] = useState(''); // Término de búsqueda global
  const [allUsers, setAllUsers] = useState<Array<UserResponse>>([]); // Todos los usuarios para búsqueda global
  const [isSearching, setIsSearching] = useState(false); // Estado de búsqueda activa
  
  // Debounce el término de búsqueda para mejorar la experiencia
  const debouncedSearchTerm = useDebounce(globalSearchTerm, 300);
  
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Check token validity and set user name
  useEffect(() => {
    if (!isTokenValid()) {
      void navigate({ to: "/auth" });
    } else {
      const name = localStorage.getItem("userName");
      setUserName(name || "Usuario");
    }
  }, [navigate]);

  // Retrieve dark mode state from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.body.classList.toggle("dark-mode", savedDarkMode);
  }, []);

  // Responsive sidebar
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

  // Efecto para cargar todos los usuarios cuando se inicia una búsqueda
  useEffect(() => {
    const loadAllUsers = async (): Promise<void> => {
      if (debouncedSearchTerm && allUsers.length === 0) {
        try {
          setIsSearching(true);
          const response = await fetchAllUsers();
          setAllUsers(response.data);
        } catch (error) {
          console.error("Error loading all users for search:", error);
        } finally {
          setIsSearching(false);
        }
      }
    };

    void loadAllUsers();
  }, [debouncedSearchTerm, allUsers.length]);

  // Toggle dark mode and save state to localStorage
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.body.classList.toggle("dark-mode", newDarkMode);
  };

  // Función para manejar búsqueda global
  const handleGlobalSearch = (searchTerm: string): void => {
    setGlobalSearchTerm(searchTerm);
    // Al buscar, volver a la primera página para mostrar los resultados desde el inicio
    if (searchTerm !== globalSearchTerm) {
      setPage(1);
    }
  };

  // Filtrar usuarios basado en el término de búsqueda global (usando debounce)
  const filteredUsers = debouncedSearchTerm
    ? (allUsers.length > 0 ? allUsers : users).filter((user) => {
        const searchLower = debouncedSearchTerm.toLowerCase();
        
        // Función auxiliar para verificar si un campo contiene el término de búsqueda
        const fieldContainsSearch = (field: string | null | undefined): boolean => {
          return field ? field.toLowerCase().includes(searchLower) : false;
        };
        
        return (
          fieldContainsSearch(user.name) ||
          fieldContainsSearch(user.email) ||
          fieldContainsSearch(user.dni) ||
          fieldContainsSearch(user.contact) ||
          fieldContainsSearch(user.rol?.name) ||
          fieldContainsSearch(user.address)
        );
      })
    : users;

  const handleRegisterUser = async (userData: UserRequestV2): Promise<void> => {
    try {
      const isRegister = await registerUser(userData);

      if (isRegister.success) {
        setShowModal(false);
        setReload(!reload);
        toast.success("Usuario registrado exitosamente!");
      } else {
        toast.error(
          "No se pudo registrar el usuario. Por: " + (isRegister.message || "favor, inténtalo de nuevo.")
        );
      }
   
    } catch (error) {
      toast.error(
        "No se pudo registrar el usuario. Por: " + (error as string || "favor, inténtalo de nuevo.")
      );
    }
  };

  const handleUpdateUser = async (
    userId: number,
    userData: UserRequestV2
  ): Promise<void> => {
    try {
      await updateUser(userId, userData);
      setReload(!reload);
      setShowUpdateModal(false);
      toast.success("Usuario actualizado exitosamente!");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(
        "No se pudo actualizar el usuario. Por favor, inténtalo de nuevo."
      );
    }
  };

  const handleDeleteUser = async (userId: number): Promise<void> => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (confirmed) {
      try {
        await deleteUser(userId);
        setReload(!reload);
        toast.success("Usuario eliminado exitosamente!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error(
          "No se pudo eliminar el usuario. Por favor, inténtalo de nuevo."
        );
      }
    }
  };

  const handleOpenUpdateModal = (user: UserResponse): void => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  // Function to handle navigation from sidebar
  const handleNavigation = (path: string) => {
    void navigate({ to: path });
    setIsOpen(false);
  };

  // Callbacks para las tablas
  const handleAddNewUser = (): void => {
    setShowModal(true);
  };

  const sidebarWidth = isMobile ? undefined : (sidebarExpanded ? "16rem" : "4.5rem");

  return (
    <>
      <ToastContainer />

      <div
        className={`flex min-h-screen font-sans relative overflow-x-auto ${
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
          LogoutButtonStyled   ={<LogoutButtonStyled />}
          acuaterraLogo        ={acuaterraLogo}
          animateSidebar       ={animateSidebar}
          darkMode             ={darkMode}
          handleNavigation     ={handleNavigation}
          isMobile             ={isMobile}
          isOpen               ={isOpen}
          items                ={sidebarItems}
          location             ={{ pathname: window.location.pathname }}
          menuRef              ={menuRef}
          setIsOpen            ={setIsOpen}
          toggleDarkMode       ={toggleDarkMode}
          userName             ={userName}
          onSidebarExpandChange={setSidebarExpanded} 
        />

        <main
          className={`flex-1 p-9 ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
          } overflow-y-auto transition-all duration-300`}
          style={{
            marginLeft: isMobile ? undefined : sidebarWidth, 
            background: darkMode ? "#111827" : "#fff",      
            transition: "margin-left 0.5s cubic-bezier(.4,0,.2,1), background 0.3s cubic-bezier(.4,0,.2,1)",
          }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 text-center">
            Lista de Usuarios
          </h1>

          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <LoaderAcua darkMode={darkMode} />
            </div>
          ) : error ? (
            <div className="mt-4 text-red-500 flex items-center">
              <p>Error: {String(error)}</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className={`hidden md:block rounded-lg p-4 shadow-md w-full max-w-7xl mx-auto border transition-colors duration-300 ${
                  darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-300 text-black"
              }`}>
                <TableWithActions
                  darkMode={darkMode}
                  data={filteredUsers}
                  error={error}
                  limit={limit}
                  loading={loading || isSearching}
                  page={page}
                  searchPlaceholder="🔍 Buscar usuarios por nombre, email, DNI, teléfono o rol..."
                  searchTerm={globalSearchTerm}
                  setLimit={setLimit}
                  setPage={setPage}
                  total={debouncedSearchTerm ? filteredUsers.length : total}
                  columns={[
                    { header: "ID",       accessor: "id"      },
                    { header: "Nombre",   accessor: "name"    },
                    { header: "Email",    accessor: "email"   },
                    { header: "DNI",      accessor: "dni"     },
                    { header: "Teléfono", accessor: "contact" },
                    {
                      header: "Rol",
                      accessor: "rol",
                      render: (u: UserResponse) => u.rol.name,
                    },
                    {
                      header: "Fecha de creación",
                      accessor: "createdAt",
                      render: (u: UserResponse) =>
                        new Date(u.createdAt).toLocaleDateString(),
                    },
                    {
                      header: "Fecha de actualización",
                      accessor: "updatedAt",
                      render: (u: UserResponse) =>
                        new Date(u.updatedAt).toLocaleDateString(),
                    },
                  ]}
                  onAdd={handleAddNewUser}
                  onDelete={handleDeleteUser}
                  onEdit={handleOpenUpdateModal}
                  onGlobalSearch={handleGlobalSearch}
                />
              </div>

              {/* Mobile table */}
              <div className={`block md:hidden rounded-lg p-4 shadow-md w-full max-w-sm mx-auto border transition-colors duration-300 ${
                darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-300 text-black"
              }`}>
                <TableWithActionsMobile
                  darkMode={darkMode}
                  data={filteredUsers}
                  error={error}
                  limit={limit}
                  loading={loading || isSearching}
                  page={page}
                  searchPlaceholder="🔍 Buscar usuarios por nombre, email, DNI, teléfono o rol..."
                  searchTerm={globalSearchTerm}
                  setLimit={setLimit}
                  setPage={setPage}
                  total={debouncedSearchTerm ? filteredUsers.length : total}
                  columns={[
                    { header: "ID",       accessor: "id"    },
                    { header: "Nombre",   accessor: "name"  },
                    { header: "Email",    accessor: "email" },
                    { header: "DNI",      accessor: "dni"   },
                    {
                      header: "Rol",
                      accessor: "rol",
                      render: (u: UserResponse) => u.rol.name,
                    },
                    { header: "Dirección",          accessor: "address"   },
                    { header: "Fecha de creación",  accessor: "createdAt" },
                    { header: "Fecha actualización", accessor: "updatedAt" },
                  ]}
                  onAdd={handleAddNewUser}
                  onDelete={handleDeleteUser}
                  onEdit={handleOpenUpdateModal}
                  onGlobalSearch={handleGlobalSearch}
                />
              </div>
            </>
          )}

              <RegisterUserModal
                darkMode={darkMode}
                setShowModal={setShowModal}
                showModal={showModal}
                onRegister={handleRegisterUser}
              />
              {selectedUser && (
                <UpdateUserModal
                  darkMode={darkMode}
                  setShowModal={setShowUpdateModal}
                  showModal={showUpdateModal}
                  user={selectedUser}
                  onUpdate={handleUpdateUser}
              />
          )}
        </main>
      </div>
    </>
  );
};

export default Users;