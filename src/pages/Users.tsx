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
import { Menu, X } from "lucide-react";
import LogoutButton from "../components/ui/button/logoutButton";

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
    try {
      await registerUser(userData); 
      setReload(!reload); 
      setShowModal(false); // Close the modal after registration
      toast.success("Usuario registrado exitosamente!");
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      toast.error("No se pudo registrar el usuario. Por favor, inténtalo de nuevo.");
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
      toast.error("No se pudo actualizar el usuario. Por favor, inténtalo de nuevo.");
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
        toast.error("No se pudo eliminar el usuario. Por favor, inténtalo de nuevo.");
      }
    }
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
          onClick={() => {
            setIsOpen(!isOpen);
          }}
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
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <X size={24} />
            </button>
            <img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
            <p className="text-gray-700 font-semibold">Bienvenido, usuario!</p>
          </div>

          <nav className="flex-1">
            <ul className="space-y-3 md:space-y-20 mt-4 md:mt-20">
              <li
                className="flex items-center justify-center gap-3 p-2 cursor-pointer transition-all duration-300 transform origin-center overflow-hidden hover:bg-gray-400 hover:scale-102 rounded-lg"
                onClick={async () => {
                  await navigate({ to: "/newHome" });
                  setIsOpen(false);
                }}
              >
                <img alt="Inicio" className="h-6 w-6" src={homeIcon} />
                <span className="font-bold">Inicio</span>
              </li>
              <li
                className="flex items-center justify-center gap-3 p-2 cursor-pointer transition-all duration-300 transform origin-center overflow-hidden hover:bg-gray-400 hover:scale-102 rounded-lg"
                onClick={async () => {
                  await navigate({ to: "/farm" });
                  setIsOpen(false);
                }}
              >
                <img alt="Granjas" className="h-6 w-6" src={moduleIcon} />
                <span className="font-bold">Granjas</span>
              </li>
              <li
                className="flex items-center justify-center gap-3 p-2 cursor-pointer transition-all duration-300 transform origin-center overflow-hidden hover:bg-gray-400 hover:scale-102 bg-gray-400 text-white border-2 border-gray-400 rounded-lg"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <img alt="Usuarios" className="h-6 w-6" src={userIcon} />
                <span className="font-bold">Usuarios</span>
              </li>
              <li
              className="
                flex items-center justify-center gap-3 p-2
                cursor-pointer transition-all duration-300
                transform origin-center overflow-hidden
                hover:bg-gray-400 hover:scale-102
                rounded-lg
              "
              onClick={async () => {
                await navigate({ to: "/module" });
                setIsOpen(false);
              }}
            >
              <img alt="Módulos" className="h-6 w-6" src={fishIcon} />
              <span className="font-bold">Módulos</span>
            </li>

            <li
              className="
                flex items-center justify-center gap-3 p-2
                cursor-pointer transition-all duration-300
                transform origin-center overflow-hidden
                hover:bg-gray-400 hover:scale-102
                rounded-lg
              "
              onClick={async () => {
                await navigate({ to: "/report" });
                setIsOpen(false);
              }}
            >
              <img alt="Reporte" className="h-6 w-6" src={reportIcon} />
              <span className="font-bold">Reporte</span>
            </li>
            </ul>
            <div className="mt-4 md:mt-20">
            <ul className="space-y-4">
              <li
                className="
                  flex items-center justify-center gap-3 p-2
                  cursor-pointer transition-all duration-300
                  transform origin-center overflow-hidden
                  hover:bg-gray-300 hover:scale-102
                  rounded-lg
                "
              >
                <LogoutButton />
              </li>
            </ul>
          </div>
          </nav>
        </aside>

        <main className="flex-1 p-9 bg-white md:ml-0">
          <h1 className="text-2xl font-bold mb-4 text-center">Lista de Usuarios</h1>

          {loading ? (
            <LoaderAcua />
          ) : error ? (
            <div className="mt-4 text-red-500 flex items-center">
              <p>Error: {String(error)}</p>
            </div>
          ) : (
            <>
              {/* Tabla de escritorio */}
              <div className="hidden md:block">
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

              {/* Tabla de móvil */}
              <div className="block md:hidden">
                <TableWithActionsMobile
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
            </>
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