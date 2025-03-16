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
import LoaderAcua from "../components/loaders/LoaderAcua";

import closeSessionIcon from "../assets/images/cerrar-sesion.png";
import userIcon from "../assets/images/userlogo.png";
import moduleIcon from "../assets/images/module.png";
import homeIcon from "../assets/images/home.png";
import acuaterraLogo from "../assets/images/logo.png";
import reportIcon from "../assets/images/reporte.png";
import fishIcon from "../assets/images/pez.png";
import { Menu, X } from "lucide-react";

export const Users: FunctionComponent = () => {
  const navigate = useNavigate();


  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(false);


  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

 
  const pageSize = 10;
  const { users, loading, error, total } = useUsers(page, pageSize, reload);
  const { registerUser } = useRegisterUser();

  
  const [isOpen, setIsOpen] = useState(false);

  
  const handleRegisterUser = async (userData: UserRequestV2): Promise<void> => {
    await registerUser(userData);
    setReload(!reload);
    setShowModal(false);
    toast.success("Usuario registrado exitosamente!");
  };

  const handleDeleteUser = async (userId: number): Promise<void> => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmed) {
      await deleteUser(userId);
      setReload(!reload);
      toast.success("Usuario eliminado exitosamente!");
    }
  };

  const handleUpdateUser = async (userId: number, userData: UserRequestV2): Promise<void> => {
    await updateUser(userId, userData);
    setReload(!reload);
    setShowUpdateModal(false);
    toast.success("Usuario actualizado exitosamente!");
  };

  const handleOpenUpdateModal = (user: UserResponse): void => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };


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

  return (
    <>
      <ToastContainer />

      
      <div className="flex min-h-screen font-sans bg-white relative overflow-x-auto">
       
        <button
          className="absolute top-9 left-4 z-50 bg-gray-300 p-2 rounded shadow-md md:hidden"
          id="menu-button"
          onClick={() => { setIsOpen(!isOpen); }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        
        <aside
          id="sidebar"
          className={`fixed top-0 left-0 w-64 h-screen bg-gray-300 border-r border-gray-300 flex flex-col transform transition-transform duration-300 ease-in-out z-50
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:w-64 md:relative`}
        >
          <div className="p-4 flex flex-col items-center relative">
           
            <button
              className="absolute top-2 right-2 p-2 text-gray-700 hover:text-gray-900 md:hidden"
              onClick={() => { setIsOpen(false); }}
            >
              <X size={24} />
            </button>
            <img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
            <p className="text-gray-700 font-semibold">Bienvenido, usuario!</p>
          </div>

          <nav className="flex-1">
            <ul className="space-y-3 md:space-y-20 mt-4 md:mt-20">
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                onClick={async () => {
                  await navigate({ to: "/newHome" });
                  setIsOpen(false);
                }}
              >
                <img alt="Inicio" className="h-6 w-6 mr-2" src={homeIcon} />
                <span className="font-bold">Inicio</span>
              </li>
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
                onClick={async () => {
                  await navigate({ to: "/farm" });
                  setIsOpen(false);
                }}
              >
                <img alt="Granjas" className="h-6 w-6 mr-2" src={moduleIcon} />
                <span className="font-bold">Granjas</span>
              </li>
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105 bg-gray-400 text-white border-2 border-gray-400 rounded-lg"
                onClick={() => { setIsOpen(false); }}
              >
                <img alt="Usuarios" className="h-6 w-6 mr-2" src={userIcon} />
                <span className="font-bold">Usuarios</span>
              </li>
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                onClick={async () => {
                  await navigate({ to: "/module" });
                  setIsOpen(false);
                }}
              >
                <img alt="Módulos" className="h-6 w-6 mr-2" src={fishIcon} />
                <span className="font-bold">Módulos</span>
              </li>
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                onClick={async () => {
                  await navigate({ to: "/report" });
                  setIsOpen(false);
                }}
              >
                <img alt="Reporte" className="h-6 w-6 mr-2" src={reportIcon} />
                <span className="font-bold">Reporte</span>
              </li>
            </ul>

            <div className="mt-4 md:mt-20">
              <ul className="space-y-4">
                <li
                  className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                  onClick={async () => {
                    await navigate({ to: "/auth" });
                    setIsOpen(false);
                  }}
                >
                  <img alt="Cerrar Sesión" className="h-6 w-6 mr-2" src={closeSessionIcon} />
                  <span className="font-bold">Cerrar Sesión</span>
                </li>
              </ul>
            </div>
          </nav>

          <div className="p-0">
            <p className="text-center text-xs mt-2">
              versión 1.0 <br />
              Advanced Aquaponics Monitoring System
            </p>
          </div>
        </aside>

      
        <main className="flex-1 p-9 bg-white md:ml-0">
          <h1 className="text-2xl font-bold mb-4 text-center">Lista de Usuarios</h1>

          <LoaderAcua />
          {loading ? (
            <div className="flex justify-center items-center h-32" />
          ) : error ? (
            <div className="mt-4 text-red-500 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10.29 3.86l-6.6 11.45a1 1 0 00.86 1.5h13.3a1 1 0 00.86-1.5l-6.6-11.45a1 1 0 00-1.72 0zM12 9v4m0 4h.01"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <p>Error: {String(error)}</p>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-1 shadow-md overflow-x-auto">
              <TableWithActions
                data={users}
                error={error}
                limit={pageSize}
                loading={loading}
                page={page}
                setLimit={() => {}}
                setPage={setPage}
                total={total}
                columns={[
                  { header: "ID", accessor: "id" },
                  { header: "Name", accessor: "name" },
                  { header: "Email", accessor: "email" },
                  { header: "DNI", accessor: "dni" },
                  {
                    header: "Role",
                    accessor: "rol",
                    render: (u: UserResponse) => u.rol.name,
                  },
                  { header: "Address", accessor: "address" },
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
          )}

          <RegisterUserModal
            setShowModal={setShowModal}
            showModal={showModal}
            onRegister={handleRegisterUser}
          />
          {selectedUser && (
            <UpdateUserModal
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
