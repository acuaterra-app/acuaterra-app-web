import { useState } from "react";
import { motion } from "framer-motion";
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
               className={`font-bold px-4 py-2 rounded border transition-colors duration-200
                  ${darkMode
                       ? "text-cyan-400 border-cyan-400 hover:bg-cyan-900"
                       : "text-primary border-primary hover:bg-cyan-100"
                  }`}
                onClick={() => { setCurrentSection(currentSection - 1); }}
                >
                 ← Anterior
            </button>
          )}
          {currentSection < 2 && (
            <button
              className={`font-bold ml-auto px-4 py-2 rounded border transition-colors duration-200
                 ${darkMode
                      ? "text-cyan-400 border-cyan-400 hover:bg-cyan-900"
                      : "text-primary border-primary hover:bg-cyan-100"
                 }`}
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
              className={`block font-bold mb-4 text-lg ${darkMode ? "text-gray-200" : "text-gray-700"}`}
              htmlFor="users"
            >
              <span className="flex items-center gap-2">
                <span>Seleccionar Usuarios</span>
                {selectedUsers.length > 0 && (
                  <motion.span
                    animate={{ scale: 1, opacity: 1 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      darkMode ? "bg-cyan-700 text-cyan-200" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {selectedUsers.length} seleccionado{selectedUsers.length !== 1 ? 's' : ''}
                  </motion.span>
                )}
              </span>
              <span className={`block text-sm font-normal mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Debes seleccionar al menos un usuario tipo "owner" para crear/editar la granja
              </span>
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
                    <motion.div
                      animate={{ opacity: 1, scale: 1 }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`text-center py-12 px-6 rounded-xl ${
                        darkMode
                          ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600"
                          : "bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200"
                      }`}
                    >
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        darkMode ? "bg-cyan-900 text-cyan-400" : "bg-blue-100 text-blue-600"
                      }`}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <h3 className={`text-lg font-semibold mb-2 ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}>
                        No hay usuarios disponibles
                      </h3>
                      <p className={`text-sm mb-4 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                        No se encontraron usuarios tipo "owner" en esta página.
                      </p>
                      <div className="space-y-2">
                        <p className={`text-xs ${
                          darkMode ? "text-cyan-400" : "text-blue-600"
                        }`}>
                          💡 Prueba navegar a otras páginas para encontrar usuarios disponibles
                        </p>
                        {totalPages > 1 && (
                          <p className={`text-xs ${
                            darkMode ? "text-gray-500" : "text-gray-400"
                          }`}>
                            Página {page} de {totalPages}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.table
                      animate={{ opacity: 1, y: 0 }}
                      className="table-auto w-full text-left border-collapse"
                      initial={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
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
                            <motion.tr
                              key={user.id}
                              animate={{ opacity: 1, x: 0 }}
                              initial={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              className={`transition-all duration-200 cursor-pointer border-b ${
                                index % 2 === 0
                                  ? darkMode
                                    ? "bg-gray-800 hover:bg-gray-700"
                                    : "bg-gray-100 hover:bg-gray-50"
                                  : darkMode
                                  ? "bg-gray-700 hover:bg-gray-600"
                                  : "bg-white hover:bg-gray-50"
                              } ${selectedUsers.includes(user.id) ? (
                                darkMode ? 'ring-2 ring-cyan-500 bg-cyan-900' : 'ring-2 ring-blue-500 bg-blue-50'
                              ) : ''}`}
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
                            </motion.tr>
                          ))}
                      </tbody>
                    </motion.table>
                  )}
                  <motion.div 
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <motion.button
                      disabled={page === 1}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        page === 1 
                          ? darkMode
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : darkMode
                            ? "bg-gray-600 text-white hover:bg-gray-500 shadow-md hover:shadow-lg"
                            : "bg-quaternary text-white hover:bg-quinary shadow-md hover:shadow-lg"
                      }`}
                      onClick={() => { setPage(page - 1); }}
                    >
                      ← Anterior
                    </motion.button>
                    <span className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                      Página {page} de {totalPages}
                    </span>
                    <motion.button
                      disabled={page === totalPages}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        page === totalPages 
                          ? darkMode
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : darkMode
                            ? "bg-primary text-white hover:bg-cyan-700 shadow-md hover:shadow-lg"
                            : "bg-primary text-white hover:bg-secondary shadow-md hover:shadow-lg"
                      }`}
                      onClick={() => { setPage(page + 1); }}
                    >
                      Siguiente →
                    </motion.button>
                  </motion.div>
                </>
              )}
            </div>
            {errors["users"] && (
              <p className={`text-sm mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}>{errors["users"]}</p>
            )}
            <motion.div 
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mt-6"
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {selectedUsers.length > 0 && (
                <div className={`w-full mb-2 text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                  Usuarios seleccionados ({selectedUsers.length}):
                </div>
              )}
              {selectedUsers.map((userId, index) => {
                const user = users.find((u) => u.id === userId);
                return (
                  <motion.span
                    key={userId}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium shadow-md ${
                      darkMode 
                        ? "bg-gradient-to-r from-cyan-700 to-cyan-600 text-white" 
                        : "bg-gradient-to-r from-primary to-blue-600 text-white"
                    }`}
                  >
                    {user?.name}
                  </motion.span>
                );
              })}
            </motion.div>
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