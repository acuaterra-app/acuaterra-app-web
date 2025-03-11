/**
 * Página de Usuarios - Acuaterra (Users).
 * Visual: Basado en el diseño de Figma,
 * La lógica de CRUD se mantiene intacta.
 */

import type { FunctionComponent } from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState } from "react";
import type { UserRequest, User } from "../common/types";
import UserTable from "../components/ui/table/table";
import useUsers from "../hooks/useUsers";
import RegisterUserModal from "../components/ui/modals/registerUserModal";
import UpdateUserModal from "../components/ui/modals/updateUserModalProps";
import useRegisterUser from "../hooks/useRegisterUser";
import { deleteUser, updateUser } from "../services/userService";
import Layout from "../components/layout/layout";
import { useNavigate } from "@tanstack/react-router";

// Íconos e imágenes
import closeSessionIcon from "../assets/images/cerrar-sesion.png";
import userIcon from "../assets/images/userlogo.png";
import moduleIcon from "../assets/images/module.png";
import homeIcon from "../assets/images/home.png";
import acuaterraLogo from "../assets/images/logo.png";
import reportIcon from "../assets/images/reporte.png";
import fishIcon from "../assets/images/pez.png";

// Toast y Spinner
import Toast from "../components/ui/Toast";
import Spinner from "../components/ui/Spinner";

export const Users: FunctionComponent = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reload, setReload] = useState(false);
  const pageSize = 10;
  const { users, loading, error } = useUsers(page, pageSize, reload);
  const { registerUser } = useRegisterUser();

  // Para mostrar un toast cuando se registre un usuario exitosamente
  const [showToast, setShowToast] = useState(false);

  const handleRegisterUser = async (userData: UserRequest): Promise<void> => {
    try {
      await registerUser(userData);
      setReload(!reload);
      setShowModal(false);
      setShowToast(true); // Mostramos la notificación
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId: number): Promise<void> => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (confirmed) {
      await deleteUser(userId);
      setReload(!reload);
    }
  };

  const handleUpdateUser = async (userId: number, userData: UserRequest): Promise<void> => {
    await updateUser(userId, userData);
    setReload(!reload);
  };

  const handleOpenUpdateModal = (user: User): void => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        {/* Sidebar con fondo gris (bg-gray-300) */}
        <aside className="w-full md:w-64 bg-gray-300 border-r border-gray-300 flex flex-col">
          <div className="p-4 flex flex-col items-center">
            <img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
            <p className="text-gray-700 font-semibold">Bienvenido, usuario!</p>
          </div>
          <nav className="flex-1">
            {/* Grupo 1: "Inicio", "Usuarios" y "Módulos" */}
            <ul className="space-y-4 md:space-y-20 mt-4 md:mt-20">
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                onClick={() => navigate({ to: "/newHome" })}
              >
                <img alt="Inicio" className="h-6 w-6 mr-2" src={homeIcon} />
                <span className="font-bold">Inicio</span>
              </li>
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
                onClick={() => navigate({ to: "/farm" })}
              >
                <img alt="Granjas" className="h-6 w-6 mr-2" src={moduleIcon} />
                <span className="font-bold">Granjas</span>
              </li>
              <li className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105 bg-gray-400 text-white border-2 border-gray-400 rounded-lg">
                <img alt="Usuarios" className="h-6 w-6 mr-2" src={userIcon} />
                <span className="font-bold">Usuarios</span>
              </li>
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                onClick={() => navigate({ to: "/module" })}
              >
                <img alt="Módulos" className="h-6 w-6 mr-2" src={fishIcon} />
                <span className="font-bold">Módulos</span>
              </li>
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                onClick={() => navigate({ to: "/report" })}
              >
                <img alt="Reporte" className="h-6 w-6 mr-2" src={reportIcon} />
                <span className="font-bold">Reporte</span>
              </li>
            </ul>
            {/* Grupo 2: "Cerrar Sesión" en un bloque separado */}
            <div className="mt-4 md:mt-20">
              <ul className="space-y-4">
                <li
                  className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                  onClick={() => navigate({ to: "/auth" })}
                >
                  <img alt="Cerrar Sesión" className="h-6 w-6 mr-2" src={closeSessionIcon} />
                  <span className="font-bold">Cerrar Sesión</span>
                </li>
              </ul>
            </div>
          </nav>
          {/* Footer: Texto del footer subido un poco */}
          <div className="p-0">
            <p className="text-center text-xs mt-2">
              versión 1.0 <br />
              Advanced Aquaponics Monitoring System
            </p>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-6 bg-white">
          <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>
          {loading && (
            <div className="mt-4">
              <Spinner />
            </div>
          )}
          {error && (
            <div className="mt-4 text-red-500 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M10.29 3.86l-6.6 11.45a1 1 0 00.86 1.5h13.3a1 1 0 00.86-1.5l-6.6-11.45a1 1 0 00-1.72 0zM12 9v4m0 4h.01"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <p>Error: {String(error)}</p>
            </div>
          )}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <UserTable
                users={users}
                onDeleteUser={handleDeleteUser}
                onUpdateUser={handleOpenUpdateModal}
              />
            </div>
          )}
          <div className="flex justify-between mt-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={page === 1}
              onClick={() => {
                setPage(page - 1);
              }}
            >
              Previous
            </button>
            <div className="flex flex-col items-center mt-4">
              <button
                className="mb-4 p-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition focus:outline-none focus:ring-2 focus:ring-green-300"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Register User
              </button>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => {
                setPage(page + 1);
              }}
            >
              Next
            </button>
          </div>
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
          {/* Toast de confirmación */}
          {showToast && (
            <Toast
              message="Usuario registrado exitosamente"
              onClose={() => {
                setShowToast(false);
              }}
            />
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Users;