import useFarms from "../../../hooks/useFarms";
import useModulesByFarm from "../../../hooks/useModulesByFarm";

const FarmModuleSelector = ({
  selectedFarm,
  setSelectedFarm,
  selectedModule,
  setSelectedModule,
}: {
  selectedFarm: number | null;
  setSelectedFarm: (id: number | null) => void;
  selectedModule: number | null;
  setSelectedModule: (id: number | null) => void;
}) => {
  const { farms, loading: farmsLoading } = useFarms();

  // Pasa undefined si no hay granja seleccionada
  const { modules, loading: modulesLoading } = useModulesByFarm(selectedFarm ?? 0);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
      <div>
        <label className="block mb-1">Selecciona una granja:</label>
        <select
          className="border rounded px-2 py-1"
          value={selectedFarm ?? ""}
          onChange={e => {
            setSelectedFarm(e.target.value ? Number(e.target.value) : null);
            setSelectedModule(null);
          }}
        >
          <option value="">-- Selecciona --</option>
          {farms.map(farm => (
            <option key={farm.id ?? farm.name} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block mb-1">Selecciona un módulo:</label>
        <select
          className="border rounded px-2 py-1"
          value={selectedModule ?? ""}
          onChange={e => setSelectedModule(e.target.value ? Number(e.target.value) : null)}
          disabled={!selectedFarm || modulesLoading}
        >
            
          <option value="">-- Selecciona --</option>
          {modules.map(module => (
            <option key={module.id} value={module.id}>
              {module.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default FarmModuleSelector;