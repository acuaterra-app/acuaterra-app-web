import { useState } from "react";
import useModulesByFarm from "../hooks/useModulesByFarm";
import useFarms from "../hooks/useFarms"; // Importamos el hook para obtener las granjas
import TableWithActions from "../components/ui/table/tableWithActions";

export const Module = (): JSX.Element => {
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);

  // Usamos el hook para obtener las granjas
  const { farms, loading: farmsLoading, error: farmsError } = useFarms();

  // Usamos el hook para obtener los módulos relacionados a la granja seleccionada
  const { modules, loading, error, total, page, perPage, setPage } = useModulesByFarm(selectedFarmId || 0);

  return (
    <div className="flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Módulos</h1>

      {/* Farm Selector */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Seleccione una Granja</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
          disabled={farmsLoading} // Deshabilitamos el selector mientras cargan las granjas
          onChange={(_) => { setSelectedFarmId(Number(_.target.value)); }}
        >
          <option value="">Seleccione una granja</option>
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
        {farmsError && <p className="text-red-500 mt-2">Error al cargar las granjas</p>}
      </div>

      {/* Modules Table */}
      {selectedFarmId && (
        <div className="border border-gray-300 rounded-lg p-1 shadow-md">
          <TableWithActions
            data={modules}
            error={error}
            limit={perPage}
            loading={loading}
            page={page}
            setLimit={() => {}}
            setPage={setPage}
            total={total}
            columns={[
              { header: "ID", accessor: "id" },
              { header: "Nombre", accessor: "name" },
              { header: "Ubicación", accessor: "location" },
              { header: "Especie de Pescados", accessor: "species_fish" },
              { header: "Cantidad", accessor: "fish_quantity" },
              { header: "Dimensiones", accessor: "dimensions" },
              { header: "Creado Por", accessor: "creator" },
              { header: "Granja", accessor: "farm" },
            ]}
            onAdd={() => {
              console.log("Add new module");
            }}
            onDelete={() => {
              console.log("Delete module");
            }}
            onEdit={() => {
              console.log("Edit module");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Module;