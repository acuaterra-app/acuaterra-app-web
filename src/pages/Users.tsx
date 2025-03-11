import type { FunctionComponent } from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState } from "react";
import type { UserRequest, UserRequestV2, UserResponse } from "../common/types";
import TableWithActions from "../components/ui/table/tableWithActions";
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
import binnacleIcon from "../assets/images/bitacora.png";

// Toast y Spinner
import Toast from "../components/ui/Toast";
import Spinner from "../components/ui/Spinner";

export const Users: FunctionComponent = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [reload, setReload] = useState(false);
  const pageSize = 10;
  const { users, loading, error, total } = useUsers(page, pageSize, reload);
  const { registerUser } = useRegisterUser();

  // Para mostrar un toast cuando se registre un usuario exitosamente
  const [showToast, setShowToast] = useState(false);

  const handleRegisterUser = async (userData: UserRequestV2): Promise<void> => {
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
    await deleteUser(userId);
    setReload(!reload);
  };

  const handleUpdateUser = async (userId: number, userData: UserRequest): Promise<void> => {
    await updateUser(userId, userData);
    setReload(!reload);
  };

  const handleOpenUpdateModal = (user: UserResponse): void => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-white">
        {/* Sidebar con fondo gris (bg-gray-300) */}
        <aside className="w-64 bg-gray-300 border-r border-gray-300 flex flex-col">
          <div className="p-4 flex flex-col items-center">
            <img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
            <p className="text-gray-700 font-semibold">Bienvenido, usuario!</p>
          </div>
          <nav className="flex-1">
            {/* Grupo 1: "Inicio", "Usuarios" y "Módulos" */}
            <ul className="space-y-20 mt-20">
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                onClick={() => navigate({ to: "/newHome" })}
              >
                <img alt="Inicio" className="h-6 w-6 mr-2" src={homeIcon} />
                <span className="font-bold">Inicio</span>
              </li>
              <li className="flex items-center p-2 bg-gray-300 transition">
                <img alt="Usuarios" className="h-6 w-6 mr-2" src={userIcon} />
                <span className="font-bold">Usuarios</span>
              </li>
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                onClick={() => navigate({ to: "/module" })}
              >
                <img alt="Módulos" className="h-6 w-6 mr-2" src={moduleIcon} />
                <span className="font-bold">Módulos</span>
              </li>
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                onClick={() => navigate({ to: "/report" })}
              >
                <img alt="Reporte" className="h-6 w-6 mr-2" src={reportIcon} />
                <span className="font-bold">Reporte</span>
              </li>
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                onClick={() => navigate({ to: "/bitacoras" })}
              >
                <img alt="Reporte" className="h-6 w-6 mr-2" src={binnacleIcon} />
                <span className="font-bold">Bitacoras</span>
              </li>
            </ul>
            {/* Grupo 2: "Cerrar Sesión" en un bloque separado */}
            <div className="mt-60">
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
        <main className="flex-1 p-6">
          <p className="text-gray-700 font-semibold">Lista de Usuarios</p>
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
                { header: 'ID', accessor: 'id' },
                { header: 'Name', accessor: 'name' },
                { header: 'Email', accessor: 'email' },
                { header: 'DNI', accessor: 'dni' },
                { header: 'Role', accessor: 'rol', render: (user: UserResponse) => (user.rol).name },
                { header: 'Address', accessor: 'address' },
                { header: 'Created At', accessor: 'createdAt' },
                { header: 'Updated At', accessor: 'updatedAt' },
              ]}
              onAdd={() => { setShowModal(true); }}
              onDelete={handleDeleteUser}
              onEdit={handleOpenUpdateModal}
            />
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