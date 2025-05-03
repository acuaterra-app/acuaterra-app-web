import { useState } from "react";
import useUsers from "../../../hooks/useUsers"; // hook import
import type { FarmRequest } from "../../../common/types";
import ButtonComponent from "../button/button";
import InputCustomComponent from "../input/input";

interface FarmModalProps {
  farm: FarmRequest | null;
  onClose: () => void;
  onSave: (farmData: FarmRequest) => void;
  darkMode: boolean; // Add darkMode prop
}

const FarmModal: React.FC<FarmModalProps> = ({ farm, onClose, onSave, darkMode }) => {
  const [name, setName] = useState(farm?.name || "");
  const [address, setAddress] = useState(farm?.address || "");
  const [latitude, setLatitude] = useState(farm?.latitude || "");
  const [longitude, setLongitude] = useState(farm?.longitude || "");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedUsers, setSelectedUsers] = useState<Array<number>>(
    Array.isArray(farm?.users)
      ? farm.users.map((user) => (typeof user === "number" ? user : user.id))
      : []
  );
  const [currentSection, setCurrentSection] = useState(1); // 1: Form, 2: Users

  const { users, loading, error, total, page, limit, setPage } = useUsers();

  const totalPages = Math.ceil(total / limit);

  const handleUserSelection = (userId: number): void => {
    setSelectedUsers((previous) =>
      previous.includes(userId)
        ? previous.filter((id) => id !== userId)
        : [...previous, userId]
    );
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validations for all fields
    if (!name.trim()) newErrors["name"] = "El nombre de la granja es obligatorio.";
    if (!address.trim()) newErrors["address"] = "La dirección de la granja es obligatoria.";

    // Validation for latitude
    if (!latitude.trim()) {
      newErrors["latitude"] = "La latitud es obligatoria.";
    } else if (!/^-?\d+(\.\d+|,\d+)?$/.test(latitude)) {
      newErrors["latitude"] = "La latitud debe ser un número válido.";
    } else if (parseFloat(latitude.replace(",", ".")) < -90 || parseFloat(latitude.replace(",", ".")) > 90) {
      newErrors["latitude"] = "La latitud debe estar entre -90 y 90.";
    }

    // Validation for longitude
    if (!longitude.trim()) {
      newErrors["longitude"] = "La longitud es obligatoria.";
    } else if (!/^-?\d+(\.\d+|,\d+)?$/.test(longitude)) {
      newErrors["longitude"] = "La longitud debe ser un número válido.";
    } else if (parseFloat(longitude.replace(",", ".")) < -180 || parseFloat(longitude.replace(",", ".")) > 180) {
      newErrors["longitude"] = "La longitud debe estar entre -180 y 180.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (!validateForm()) {
      return;
    }

    // Check if at least one user is selected
    if (selectedUsers.length === 0) {
      setErrors({ users: "Debes seleccionar al menos un usuario de tipo owner." });
      setCurrentSection(2); // Redirect to the Users section
      return;
    }

    onSave({ name, address, latitude, longitude, users: selectedUsers });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        style={{ maxHeight: "90vh" }}
        className={`bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-primary">
          {farm ? "Editar Granja" : "Agregar Granja"}
        </h2>

        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mb-6">
          {currentSection > 1 && (
            <button
              className="text-primary font-bold"
              onClick={() => { setCurrentSection(currentSection - 1); }}
            >
              ← Anterior
            </button>
          )}
          {currentSection < 2 && (
            <button
              className="text-primary font-bold ml-auto"
              onClick={() => { setCurrentSection(currentSection + 1); }}
            >
              Siguiente →
            </button>
          )}
        </div>

        {/* Section 1: Form */}
        {currentSection === 1 && (
          <div className="space-y-6">
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="name"
              >
                Nombre de la Granja
              </label>
              <InputCustomComponent
                className="w-full p-2 border-lightGray rounded focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                name="name"
                placeholder="Ingresa Nombre de la Granja"
                value={name}
                // eslint-disable-next-line unicorn/prevent-abbreviations
                onChange={(e) => { setName(e.target.value); }}
              />
              {errors["name"] && (
                <p className="text-red-500 text-sm mt-1">{errors["name"]}</p>
              )}
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="address"
              >
                Dirección de la Granja
              </label>
              <InputCustomComponent
                className="w-full p-2 border-lightGray rounded focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                name="address"
                placeholder="Ingresa Dirección de la Granja"
                value={address}
                // eslint-disable-next-line unicorn/prevent-abbreviations
                onChange={(e) => { setAddress(e.target.value); }}
              />
              {errors["address"] && (
                <p className="text-red-500 text-sm mt-1">{errors["address"]}</p>
              )}
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="longitude"
              >
                Longitud
              </label>
              <InputCustomComponent
                className="w-full p-2 border-lightGray rounded focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                name="longitude"
                placeholder="Longitud (Valor debe estar entre -180 y 180)"
                type="text"
                value={longitude}
                // eslint-disable-next-line unicorn/prevent-abbreviations
                onChange={(e) => { setLongitude(e.target.value); }}
              />
              {errors["longitude"] && (
                <p className="text-red-500 text-sm mt-1">{errors["longitude"]}</p>
              )}
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="latitude"
              >
                Latitud
              </label>
              <InputCustomComponent
                className="w-full p-2 border-lightGray rounded focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                name="latitude"
                placeholder="Latitud (Valor debe estar entre -90 y 90)"
                type="text"
                value={latitude}
                // eslint-disable-next-line unicorn/prevent-abbreviations
                onChange={(e) => { setLatitude(e.target.value); }}
              />
              {errors["latitude"] && (
                <p className="text-red-500 text-sm mt-1">{errors["latitude"]}</p>
              )}
            </div>
          </div>
        )}

        {/* Section 2: Users */}
        {currentSection === 2 && (
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="users"
            >
              Usuarios, debes seleccionar al menos uno para crear una Granja
            </label>
            <div
              className={`border p-4 rounded max-h-96 overflow-y-auto ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-50 text-black"
              }`}
            >
              {loading ? (
                <p className="text-gray-500">Cargando usuarios...</p>
              ) : error ? (
                <p className="text-red-500">Error al cargar usuarios</p>
              ) : (
                <>
                  {users.filter((user) => user.id_rol === 2).length === 0 ? (
                    <p className="text-gray-500">
                      No hay usuarios tipo "owner" en esta página.
                    </p>
                  ) : (
                    <table className="table-auto w-full text-left border-collapse">
                      <thead className={`${darkMode ? "bg-gray-900 text-white" : "bg-primary text-white"}`}>
                        <tr>
                          <th className="px-4 py-2 border-b">Seleccionar</th>
                          <th className="px-4 py-2 border-b">Nombre</th>
                          <th className="px-4 py-2 border-b">Correo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users
                          .filter((user) => user.id_rol === 2)
                          .map((user, index) => (
                            <tr
                              key={user.id}
                              className={`${
                                index % 2 === 0
                                  ? darkMode
                                    ? "bg-gray-800"
                                    : "bg-gray-100"
                                  : darkMode
                                  ? "bg-gray-700"
                                  : "bg-white"
                              } hover:bg-gray-200`}
                            >
                              <td className="px-4 py-2 border-b">
                                <input
                                  checked={selectedUsers.includes(user.id)}
                                  id={`user-${user.id}`}
                                  type="checkbox"
                                  onChange={() => { handleUserSelection(user.id); }}
                                />
                              </td>
                              <td className="px-4 py-2 border-b">{user.name}</td>
                              <td className="px-4 py-2 border-b">{user.email}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      className="px-4 py-2 bg-quaternary text-white rounded hover:bg-quinary"
                      disabled={page === 1}
                      type="button"
                      onClick={() => { setPage(page - 1); }}
                    >
                      Anterior
                    </button>
                    <span className="text-gray-700">
                      Página {page} de {totalPages}
                    </span>
                    <button
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
                      disabled={page === totalPages}
                      type="button"
                      onClick={() => { setPage(page + 1); }}
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              )}
            </div>
            {errors["users"] && (
              <p className="text-red-500 text-sm mt-1">{errors["users"]}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedUsers.map((userId) => {
                const user = users.find((u) => u.id === userId);
                return (
                  <span
                    key={userId}
                    className="bg-primary text-white px-3 py-1 rounded"
                  >
                    {user?.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <ButtonComponent
            className="bg-quaternary text-white px-6 py-3 rounded hover:bg-quinary"
            onClick={onClose}
          >
            Cancelar
          </ButtonComponent>
          <ButtonComponent
            className="bg-primary text-white px-6 py-3 rounded hover:bg-secondary"
            type="button"
            onClick={handleSubmit}
          >
            {farm ? "Guardar" : "Agregar"}
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default FarmModal;