import type React from 'react';
// eslint-disable-next-line no-duplicate-imports
import { useState } from 'react';
import type { UserRequestV2 } from '../../../common/types';

interface RegisterUserModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onRegister: (userData: UserRequestV2) => Promise<void>;
}

const RegisterUserModal: React.FC<RegisterUserModalProps> = ({ showModal, setShowModal, onRegister }) => {
  const [userData, setUserData] = useState<UserRequestV2>({
    name: '',
    email: '',
    dni: '',
    // eslint-disable-next-line camelcase
    id_rol: 0,
    address: '',
  });

  // eslint-disable-next-line unicorn/prevent-abbreviations, @typescript-eslint/explicit-function-return-type
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // eslint-disable-next-line unicorn/prevent-abbreviations, @typescript-eslint/explicit-function-return-type
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRegister(userData);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-primary">Registrar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                name="name"
                type="text"
                value={userData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                name="email"
                type="email"
                value={userData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">DNI</label>
              <input
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                name="dni"
                type="text"
                value={userData.dni}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <select
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                name="rol"
                value={userData.id_rol}
                onChange={handleChange}
              >
                <option value="">Seleccione un rol</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                name="address"
                type="text"
                value={userData.address}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-2 rounded transition"
              type="button"
              onClick={() => { setShowModal(false); }}
            >
              Cancelar
            </button>
            <button
              className="bg-primary hover:bg-secondary text-white font-semibold px-4 py-2 rounded transition"
              type="submit"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserModal;