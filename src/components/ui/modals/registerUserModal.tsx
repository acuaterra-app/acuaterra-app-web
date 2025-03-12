import type React from 'react';
// eslint-disable-next-line no-duplicate-imports
import { useState } from 'react';
import type { UserRequestV2 } from '../../../common/types';

// Paleta de colores del proyecto (para referencia)
const colors = {
  primary: '#44cbd3',
  secondary: '#3cacac',
  tertiary: '#34969e',
  quaternary: '#84bd7d',
  quinary: '#7fb050',
  lightGray: '#ccd7d6',
  greenish: '#6ca09c',
  teal: '#649c94',
  darkGray: '#5d7a7e', // ErrorMesagge color
  veryDark: '#303537',
};

interface RegisterUserModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onRegister: (userData: UserRequestV2) => Promise<void>;
}

const RegisterUserModal: React.FC<RegisterUserModalProps> = ({
  showModal,
  setShowModal,
  onRegister,
}) => {
  const [userData, setUserData] = useState<UserRequestV2>({
    name: '',
    email: '',
    dni: '',
    // eslint-disable-next-line camelcase
    id_rol: 0,
    address: '',
  });

  const handleChange = (
    // eslint-disable-next-line unicorn/prevent-abbreviations
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  ) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Contenedor del modal */}
      <div
        className="w-full max-w-md rounded-lg shadow-lg p-6"
        style={{ backgroundColor: '#fff' }}
      >
        {/* Título del modal */}
        <h2
          className="text-center text-xl font-bold mb-4"
          style={{ color: colors.primary }}
        >
          Registrar Usuario
        </h2>

        {/* Formulario */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.veryDark }}
            >
              Nombre
            </label>
            <input
              required
              className="block w-full rounded-md border p-2 shadow-sm focus:ring focus:border"
              name="name"
              placeholder="Ingrese nombre del usuario"
              type="text"
              value={userData.name}
              style={{
                borderColor: colors.lightGray,
                color: colors.veryDark,
                outline: 'none',
              }}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.veryDark }}
            >
              Email
            </label>
            <input
              required
              className="block w-full rounded-md border p-2 shadow-sm focus:ring focus:border"
              name="email"
              placeholder="Ingrese correo electrónico"
              type="email"
              value={userData.email}
              style={{
                borderColor: colors.lightGray,
                color: colors.veryDark,
                outline: 'none',
              }}
              onChange={handleChange}
            />
          </div>

          {/* DNI */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.veryDark }}
            >
              DNI
            </label>
            <input
              required
              className="block w-full rounded-md border p-2 shadow-sm focus:ring focus:border"
              name="dni"
              placeholder="Ingrese DNI del usuario"
              type="text"
              value={userData.dni}
              style={{
                borderColor: colors.lightGray,
                color: colors.veryDark,
                outline: 'none',
              }}
              onChange={handleChange}
            />
          </div>

          {/* Rol */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.veryDark }}
            >
              Rol
            </label>
            <select
              required
              className="block w-full rounded-md border p-2 shadow-sm focus:ring focus:border"
              name="id_rol"
              value={userData.id_rol}
              style={{
                borderColor: colors.lightGray,
                color: colors.veryDark,
                outline: 'none',
              }}
              onChange={handleChange}
            >
              <option value="">Seleccione un rol</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Dirección */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.veryDark }}
            >
              Dirección
            </label>
            <input
              required
              className="block w-full rounded-md border p-2 shadow-sm focus:ring focus:border"
              name="address"
              placeholder="Ingrese la dirección"
              type="text"
              value={userData.address}
              style={{
                borderColor: colors.lightGray,
                color: colors.veryDark,
                outline: 'none',
              }}
              onChange={handleChange}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4">
            {/* Botón Cancelar */}
            <button
              className="px-4 py-2 font-semibold rounded-md transition duration-300 shadow-sm focus:outline-none focus:ring-2 hover:brightness-110 hover:shadow-md"
              type="button"
              style={{
                background: colors.quaternary,
                color: '#fff',
              }}
              onClick={() => { setShowModal(false); }}
            >
              Cancelar
            </button>

            {/* Botón Registrar */}
            <button
              className="px-4 py-2 font-semibold rounded-md transition duration-300 shadow-sm focus:outline-none focus:ring-2 hover:brightness-110 hover:shadow-md"
              type="submit"
              style={{
                background: colors.primary,
                color: '#fff',
              }}
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserModal;