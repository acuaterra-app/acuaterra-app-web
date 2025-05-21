/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState, useEffect } from "react";
// eslint-disable-next-line no-duplicate-imports
import type { FunctionComponent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { UserRequestV2, UserResponse } from "../common/types";
import useUsers from "../hooks/useUsers";
import RegisterUserModal from "../components/ui/modals/registerUserModal";
import UpdateUserModal from "../components/ui/modals/updateUserModalProps";
import useRegisterUser from "../hooks/useRegisterUser";
import { deleteUser, updateUser } from "../services/userService";
import TableWithActions from "../components/ui/table/tableWithActions";
import TableWithActionsMobile from "../components/ui/table/TableWithActionsMobile";
import LoaderAcua from "../components/loaders/LoaderAcua";
import userIcon from "../assets/images/userlogo.png";
import moduleIcon from "../assets/images/module.png";
import homeIcon from "../assets/images/home.png";
import acuaterraLogo from "../assets/images/logo.png";
import reportIcon from "../assets/images/reporte.png";
import fishIcon from "../assets/images/pez.png";
import { Menu, X, Sun, Moon } from "lucide-react";
import LogoutButton from "../components/ui/button/logoutButton";
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
  text-align: center;
  margin-top: 0.5rem;
    color: ${(props) => (props.darkMode ? "white" : "#4a4a4a")};
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

export const Users: FunctionComponent = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("Usuario"); // State for user name
  const [reload, setReload] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const { users, page, setPage, loading, limit, error, total, setLimit } =
    useUsers(reload);
  const { registerUser } = useRegisterUser();

  const [isOpen, setIsOpen] = useState(false);

  // Check token validity and set user name
  useEffect(() => {
    if (!isTokenValid()) {
      console.log("Redirecting to /auth from Users component");
      void navigate({ to: "/auth" });
    } else {
      const name = localStorage.getItem("userName");
      console.log("User name retrieved from localStorage:", name);
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

  const handleRegisterUser = async (userData: UserRequestV2): Promise<void> => {
    try {
      const isRegister = await registerUser(userData);

      if (isRegister) {
        setShowModal(false);
        setReload(!reload);
        toast.success("Usuario registrado exitosamente!");
      } else {
        toast.error(
          "No se pudo registrar el usuario. Por favor, inténtalo de nuevo."
        );
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      toast.error(
        "No se pudo registrar el usuario. Por favor, inténtalo de nuevo."
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
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
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
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
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
  };

  return (
    <>
      <ToastContainer />

      <div
        className={`flex min-h-screen font-sans relative overflow-x-auto ${
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
        <aside
          id="sidebar"
          className={`fixed top-0 left-0 w-64 h-screen ${
           darkMode
               ? "bg-gray-800 text-white border-gray-700"
               : "bg-[#e0e0e0] text-gray-600 border-gray-400"
            } border-r flex flex-col transform transition-transform duration-300 ease-in-out z-50 ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 md:w-64`}
             style={{
               height: "100vh",
               boxShadow: "7px 0 15px rgba(0, 0, 0, 0.2)",
               }}
          >
          <div className="p-4 flex flex-col items-center relative">
            <button
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200 md:hidden"
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
               {[{ icon: homeIcon, label: "Inicio", path: "/newhome" },
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
                       location.pathname === item.path
                         ? "bg-[#3cacac]"
                         : "bg-[#3cacac]"
                     }`}
                   ></span>
                   <span className="relative z-10 flex items-center gap-3 font-bold">
                     <img
                       alt={item.label}
                       className="h-6 w-6"
                       src={item.icon}
                       style={
                         darkMode
                           ? { filter: "invert(1) brightness(1.5) contrast(1.2)" }
                           : {}
                       }
                     />
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

        <main
          className={`flex-1 p-9 ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
          } md:ml-64 overflow-y-auto`}
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
                  data={users}
                  error={error}
                  limit={limit}
                  loading={loading}
                  page={page}
                  setLimit={setLimit}
                  setPage={setPage}
                  total={total}
                  columns={[
                    { header: "ID",       accessor: "id" },
                    { header: "Nombre",   accessor: "name" },
                    { header: "Email",    accessor: "email" },
                    { header: "DNI",      accessor: "dni" },
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
                  onDelete={handleDeleteUser}
                  onEdit={handleOpenUpdateModal}
                  onAdd={() => {
                    setShowModal(true);
                  }}
                />
              </div>

              {/* Mobile table */}
               <div className={`block md:hidden rounded-lg p-4 shadow-md w-full max-w-sm mx-auto border transition-colors duration-300 ${
                darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-300 text-black"
               }`}>
                <TableWithActionsMobile
                  darkMode={darkMode}
                  data={users}
                  error={error}
                  limit={limit}
                  loading={loading}
                  page={page}
                  setLimit={setLimit}
                  setPage={setPage}
                  total={total}
                  columns={[
                    { header: "ID",    accessor: "id" },
                    { header: "Name",  accessor: "name" },
                    { header: "Email", accessor: "email" },
                    { header: "DNI",   accessor: "dni" },
                    {
                      header: "Role",
                      accessor: "rol",
                      render: (u: UserResponse) => u.rol.name,
                    },
                    { header: "Address",    accessor: "address" },
                    { header: "Created At", accessor: "createdAt" },
                    { header: "Updated At", accessor: "updatedAt" },
                  ]}
                  onDelete={handleDeleteUser}
                  onEdit={handleOpenUpdateModal}
                  onAdd={() => {
                    setShowModal(true);
                  }}
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