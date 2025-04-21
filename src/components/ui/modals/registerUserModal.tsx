import type React from 'react';
// eslint-disable-next-line no-duplicate-imports
import { useState } from 'react';
import type { UserRequestV2 } from '../../../common/types';

const colors = {
  primary: '#44cbd3',
  secondary: '#3cacac',
  tertiary: '#34969e',
  quaternary: '#84bd7d',
  quinary: '#7fb050',
  lightGray: '#ccd7d6',
  greenish: '#6ca09c',
  teal: '#649c94',
  darkGray: '#5d7a7e',
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
    address: '', // Default value ensures it's not undefined
    contact: '',
  } as Required<UserRequestV2>);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    dni: '',
    // eslint-disable-next-line camelcase
    id_rol: '',
    address: '',
    contact: '',
  });

  const validate = (): boolean => {
    const newErrors: typeof errors = {
      name: '',
      email: '',
      dni: '',
      // eslint-disable-next-line camelcase
      id_rol: '',
      address: '',
      contact: '',
    };

    // Validations
    if (!userData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio.';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(userData.name)) {
      newErrors.name = 'El nombre solo debe contener letras.';
    }

    if (!userData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido (ejemplo@dominio.com).';
    }

    if (!userData.dni.trim()) {
      newErrors.dni = 'El DNI es obligatorio.';
    } else if (!/^\d+$/.test(userData.dni)) {
      newErrors.dni = 'El DNI debe contener solo números.';
    }

    if (!userData.id_rol) {
      // eslint-disable-next-line camelcase
      newErrors.id_rol = 'Debe seleccionar un rol.';
    }

    if (!userData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria.';
    } else if (!/^[a-zA-Z0-9\s.,-]+$/.test(userData.address)) {
      newErrors.address = 'La dirección solo debe contener letras, números y caracteres especiales.';
    }

    if (!userData.contact.trim()) {
      newErrors.contact = 'El contacto es obligatorio.';
    } else if (!/^\d+$/.test(userData.contact)) {
      newErrors.contact = 'El contacto debe contener solo números.';
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === '');
  };

  const handleChange = (
    // eslint-disable-next-line unicorn/prevent-abbreviations
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Limpiar error al cambiar el valor
  };

  // eslint-disable-next-line unicorn/prevent-abbreviations
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (validate()) {
      await onRegister(userData);
      setUserData({
        name: '',
        email: '',
        dni: '',
        // eslint-disable-next-line camelcase
        id_rol: 0,
        address: '',
        contact: '',
      });
      setErrors({
        name: '',
        email: '',
        dni: '',
        // eslint-disable-next-line camelcase
        id_rol: '',
        address: '',
        contact: '',
      });
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="w-full max-w-md rounded-lg shadow-lg p-6"
        style={{ backgroundColor: '#fff' }}
      >
        <h2
          className="text-center text-xl font-bold mb-4"
          style={{ color: colors.primary }}
        >
          Registrar Usuario
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
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
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
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
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
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
              placeholder="Ingrese identificación del usuario"
              type="text"
              value={userData.dni}
              style={{
                borderColor: colors.lightGray,
                color: colors.veryDark,
                outline: 'none',
              }}
              onChange={handleChange}
            />
            {errors.dni && (
              <p className="text-sm text-red-500 mt-1">{errors.dni}</p>
            )}
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
              <option value="1">Admin</option>
              <option value="2">Owner</option>
            </select>
            {errors.id_rol && (
              <p className="text-sm text-red-500 mt-1">{errors.id_rol}</p>
            )}
          </div>

          {/* Address */}
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
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">{errors.address}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.veryDark }}
            >
              Contacto
            </label>
            <input
              required
              className="block w-full rounded-md border p-2 shadow-sm focus:ring focus:border"
              name="contact"
              placeholder="Ingrese número telefónico"
              type="text"
              value={userData.contact}
              style={{
                borderColor: colors.lightGray,
                color: colors.veryDark,
                outline: 'none',
              }}
              onChange={handleChange}
            />
            {errors.contact && (
              <p className="text-sm text-red-500 mt-1">{errors.contact}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              className="px-4 py-2 font-semibold rounded-md transition duration-300 shadow-sm focus:outline-none focus:ring-2 hover:brightness-110 hover:shadow-md"
              type="button"
              style={{
                background: colors.quaternary,
                color: '#fff',
              }}
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cancelar
            </button>

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