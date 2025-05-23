/* eslint-disable @typescript-eslint/no-unused-vars */
import useFarms from "../../../hooks/useFarms";
import useModulesByFarm from "../../../hooks/useModulesByFarm";

const FarmModuleSelector = ({
  selectedFarm,
  setSelectedFarm,
  selectedModule,
  setSelectedModule,
  darkMode,
}: {
  selectedFarm: number | null;
  setSelectedFarm: (id: number | null) => void;
  selectedModule: number | null;
  setSelectedModule: (id: number | null) => void;
  darkMode: boolean; 
}): JSX.Element => {
  const { farms, loading: farmsLoading } = useFarms();

  // Pasa undefined si no hay granja seleccionada
  const { modules, loading: modulesLoading } = useModulesByFarm(selectedFarm ?? 0);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
      <div>
        <label className="block mb-1">Selecciona una granja:</label>
       <select
           value={selectedFarm ?? ""}
           className={`border rounded px-2 py-1 transition-colors duration-200 ${
             darkMode
               ? "bg-gray-800 text-gray-100 border-gray-600"
               : "bg-white text-gray-900 border-gray-300"
           }`}
           onChange={event_ => {
             setSelectedFarm(event_.target.value ? Number(event_.target.value) : null);
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
          disabled={!selectedFarm || modulesLoading}
          value={selectedModule ?? ""}
          className={`border rounded px-2 py-1 transition-colors duration-200 ${
            darkMode
              ? "bg-gray-800 text-gray-100 border-gray-600"
              : "bg-white text-gray-900 border-gray-300"
          }`}
          onChange={event_ => { setSelectedModule(event_.target.value ? Number(event_.target.value) : null); }}
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