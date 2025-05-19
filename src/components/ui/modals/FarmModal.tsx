import { useState } from "react";
import useUsers from "../../../hooks/useUsers"; // hook import
import type { FarmRequest } from "../../../common/types";
import ButtonComponent from "../button/button";
import InputCustomComponent from "../input/input";

interface FarmModalProps {
  farm: FarmRequest | null;
  onClose: () => void;
  onSave: (farmData: FarmRequest) => void;
  darkMode: boolean;
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        style={{ maxHeight: "90vh" }}
        className={`p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? "text-cyan-400" : "text-primary"}`}>
          {farm ? "Editar Granja" : "Agregar Granja"}
        </h2>

        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mb-6">
          {currentSection > 1 && (
            <button
              className={`font-bold ${darkMode ? "text-cyan-400" : "text-primary"}`}
              onClick={() => { setCurrentSection(currentSection - 1); }}
            >
              ← Anterior
            </button>
          )}
          {currentSection < 2 && (
            <button
              className={`font-bold ml-auto ${darkMode ? "text-cyan-400" : "text-primary"}`}
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
                className={`block font-bold mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                htmlFor="name"
              >
                Nombre de la Granja
              </label>
              <InputCustomComponent
                name="name"
                placeholder="Ingresa Nombre de la Granja"
                value={name}
                className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400 transition-colors duration-200 ${
                  darkMode
                    ? "bg-gray-900 border-gray-600 text-black placeholder-gray-400"
                    : "bg-white border-lightGray text-black"
                }`}
                onChange={(event_) => { setName(event_.target.value); }}
              />
              {errors["name"] && (
                <p className={`text-sm mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}>{errors["name"]}</p>
              )}
            </div>
            <div>
              <label
                className={`block font-bold mb-2 ${darkMode ? "text-gray-00" : "text-gray-700"}`}
                htmlFor="address"
              >
                Dirección de la Granja
              </label>
              <InputCustomComponent
                name="address"
                placeholder="Ingresa Dirección de la Granja"
                value={address}
                className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400 transition-colors duration-200 ${
                  darkMode
                    ? "bg-gray-900 border-gray-600 text-black placeholder-gray-400"
                    : "bg-white border-lightGray text-black"
                }`}
                onChange={(event_) => { setAddress(event_.target.value); }}
              />
              {errors["address"] && (
                <p className={`text-sm mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}>{errors["address"]}</p>
              )}
            </div>
            <div>
              <label
                className={`block font-bold mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                htmlFor="longitude"
              >
                Longitud
              </label>
              <InputCustomComponent
                name="longitude"
                placeholder="Longitud (Valor debe estar entre -180 y 180)"
                type="text"
                value={longitude}
                className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400 transition-colors duration-200 ${
                  darkMode
                    ? "bg-gray-900 border-gray-600 text-black placeholder-gray-400"
                    : "bg-white border-lightGray text-black"
                }`}
                onChange={(event_) => { setLongitude(event_.target.value); }}
              />
              {errors["longitude"] && (
                <p className={`text-sm mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}>{errors["longitude"]}</p>
              )}
            </div>
            <div>
              <label
                className={`block font-bold mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                htmlFor="latitude"
              >
                Latitud
              </label>
              <InputCustomComponent
                name="latitude"
                placeholder="Latitud (Valor debe estar entre -90 y 90)"
                type="text"
                value={latitude}
                className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400 transition-colors duration-200 ${
                  darkMode
                    ? "bg-gray-900 border-gray-600 text-black placeholder-gray-400"
                    : "bg-white border-lightGray text-black"
                }`}
                onChange={(event_) => { setLatitude(event_.target.value); }}
              />
              {errors["latitude"] && (
                <p className={`text-sm mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}>{errors["latitude"]}</p>
              )}
            </div>
          </div>
        )}

        {/* Section 2: Users */}
        {currentSection === 2 && (
          <div>
            <label
              className={`block font-bold mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}
              htmlFor="users"
            >
              Usuarios, debes seleccionar al menos uno para crear una Granja
            </label>
            <div
              className={`border p-4 rounded max-h-96 overflow-y-auto ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-gray-50 text-black border-gray-200"
              }`}
            >
              {loading ? (
                <p className={`${darkMode ? "text-gray-300" : "text-gray-500"}`}>Cargando usuarios...</p>
              ) : error ? (
                <p className={`${darkMode ? "text-red-400" : "text-red-500"}`}>Error al cargar usuarios</p>
              ) : (
                <>
                  {users.filter((user) => user.id_rol === 2).length === 0 ? (
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-500"}`}>
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
                              className={`transition-colors duration-200 cursor-pointer ${
                                index % 2 === 0
                                  ? darkMode
                                    ? "bg-gray-800"
                                    : "bg-gray-100"
                                  : darkMode
                                  ? "bg-gray-700"
                                  : "bg-white"
                              } hover:${darkMode ? "bg-cyan-900" : "bg-cyan-100"}`}
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
                      disabled={page === 1}
                      type="button"
                      className={`px-4 py-2 rounded ${
                        darkMode
                          ? "bg-gray-600 text-white hover:bg-gray-500"
                          : "bg-quaternary text-white hover:bg-quinary"
                      }`}
                      onClick={() => { setPage(page - 1); }}
                    >
                      Anterior
                    </button>
                    <span className={`${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                      Página {page} de {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      type="button"
                      className={`px-4 py-2 rounded ${
                        darkMode
                          ? "bg-primary text-white hover:bg-cyan-700"
                          : "bg-primary text-white hover:bg-secondary"
                      }`}
                      onClick={() => { setPage(page + 1); }}
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              )}
            </div>
            {errors["users"] && (
              <p className={`text-sm mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}>{errors["users"]}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedUsers.map((userId) => {
                const user = users.find((u) => u.id === userId);
                return (
                  <span
                    key={userId}
                    className={`px-3 py-1 rounded ${darkMode ? "bg-cyan-700 text-white" : "bg-primary text-white"}`}
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
            className={`px-6 py-3 rounded ${
              darkMode
                ? "bg-gray-600 text-white hover:bg-gray-500"
                : "bg-quaternary text-white hover:bg-quinary"
            }`}
            onClick={onClose}
          >
            Cancelar
          </ButtonComponent>
          <ButtonComponent
            type="button"
            className={`px-6 py-3 rounded ${
              darkMode
                ? "bg-primary text-white hover:bg-cyan-700"
                : "bg-primary text-white hover:bg-secondary"
            }`}
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