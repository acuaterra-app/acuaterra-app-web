import { useState } from "react";
import useUsers from "../../../hooks/useUsers"; // hook import
import type { FarmRequest } from "../../../common/types";
import ButtonComponent from "../button/button";
import InputCustomComponent from "../input/input";

interface FarmModalProps {
  farm: FarmRequest | null;
  onClose: () => void;
  onSave: (farmData: FarmRequest) => void;
}

const FarmModal: React.FC<FarmModalProps> = ({ farm, onClose, onSave }) => {
  const [name, setName] = useState(farm?.name || "");
  const [address, setAddress] = useState(farm?.address || "");
  const [latitude, setLatitude] = useState(farm?.latitude || "");
  const [longitude, setLongitude] = useState(farm?.longitude || "");
  const [errors] = useState<{ [key: string]: string }>({});
  const [selectedUsers, setSelectedUsers] = useState<Array<number>>(
    Array.isArray(farm?.users)
      ? farm.users.map((user) => (typeof user === "number" ? user : user.id))
      : []
  );

  const { users, loading, error, total, page, limit, setPage } = useUsers();

  const totalPages = Math.ceil(total / limit);

  const handleUserSelection = (userId: number): void => {
    setSelectedUsers((previous) =>
      previous.includes(userId)
        ? previous.filter((id) => id !== userId)
        : [...previous, userId]
    );
  };

  const handleSubmit = (): void => {
    if (Object.keys(errors).length === 0) {
      onSave({ name, address, latitude, longitude, users: selectedUsers });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl max-h-screen overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-primary">
          {farm ? "Editar Granja" : "Agregar Granja"}
        </h2>
        <form
          // eslint-disable-next-line unicorn/prevent-abbreviations
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left column: Form */}
            <div className="space-y-6 md:col-span-2">
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
                  placeholder="Nombre de la Granja"
                  value={name}
                  // eslint-disable-next-line unicorn/prevent-abbreviations
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
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
                  placeholder="Dirección de la Granja"
                  value={address}
                  // eslint-disable-next-line unicorn/prevent-abbreviations
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                />
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
                  placeholder="Longitud"
                  type="number"
                  value={longitude}
                  // eslint-disable-next-line unicorn/prevent-abbreviations
                  onChange={(e) => {
                    setLongitude(e.target.value);
                  }}
                />
                {errors["longitude"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors["longitude"]}
                  </p>
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
                  placeholder="Latitud"
                  type="number"
                  value={latitude}
                  // eslint-disable-next-line unicorn/prevent-abbreviations
                  onChange={(e) => {
                    setLatitude(e.target.value);
                  }}
                />
                {errors["latitude"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors["latitude"]}
                  </p>
                )}
              </div>
            </div>

            {/* Right column: User´s table */}
            <div className="md:col-span-3">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="users"
              >
                Usuarios
              </label>
              <div className="border p-4 rounded max-h-96 overflow-y-auto bg-gray-50">
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
                        <thead>
                          <tr>
                            <th className="px-4 py-2 border-b">Seleccionar</th>
                            <th className="px-4 py-2 border-b">Nombre</th>
                            <th className="px-4 py-2 border-b">Correo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users
                            .filter((user) => user.id_rol === 2)
                            .map((user) => (
                              <tr key={user.id}>
                                <td className="px-4 py-2 border-b">
                                  <input
                                    checked={selectedUsers.includes(user.id)}
                                    id={`user-${user.id}`}
                                    type="checkbox"
                                    onChange={() =>
                                      { handleUserSelection(user.id); }
                                    }
                                  />
                                </td>
                                <td className="px-4 py-2 border-b">
                                  {user.name}
                                </td>
                                <td className="px-4 py-2 border-b">
                                  {user.email}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    )}
                    <div className="flex justify-between items-center mt-4">
                      <button
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={page === 1}
                        type="button"
                        onClick={() => {
                          const previousPage = page - 1;
                          // eslint-disable-next-line no-unreachable-loop, no-unmodified-loop-condition
                          while (previousPage > 0) {
                            setPage(previousPage);
                            break;
                          }
                        }}
                      >
                        Anterior
                      </button>
                      <span className="text-gray-700">
                        Página {page} de {totalPages}
                      </span>
                      <button
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={page === totalPages}
                        type="button"
                        onClick={() => {
                          const nextPage = page + 1;
                          // eslint-disable-next-line no-unreachable-loop, no-unmodified-loop-condition
                          while (nextPage <= totalPages) {
                            setPage(nextPage);
                            break;
                          }
                        }}
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
          </div>

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
              type="submit"
            >
              {farm ? "Guardar" : "Agregar"}
            </ButtonComponent>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmModal;