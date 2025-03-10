import { useState } from "react";
// eslint-disable-next-line no-duplicate-imports
import type { FunctionComponent } from "react";
import { useNavigate } from "@tanstack/react-router";
import useFarms from "../hooks/useFarms";
import TableWithActions from "../components/ui/table/tableWithActions";
import FarmModal from "../components/ui/modals/FarmModal";
import type { FarmRequest, User } from "../common/types";
import LogoutButton from "../components/ui/button/logoutButton";
import acuaterraLogo from "../assets/images/logo.png";
import homeIcon from "../assets/images/home.png";
import moduleIcon from "../assets/images/module.png";
import reportIcon from "../assets/images/reporte.png";

const FarmsPage: FunctionComponent = () => {
  const { farms, loading, error, total, page, limit, setPage, setLimit, addFarm, editFarm, removeFarm } = useFarms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<FarmRequest | null>(null);
  const navigate = useNavigate();

  const handleAddFarm = async (farmData: FarmRequest): Promise<void> => {
    await addFarm(farmData);
    setIsModalOpen(false);
  };

  const handleEditFarm = async (farmData: FarmRequest): Promise<void> => {
    if (selectedFarm) {
      await editFarm(selectedFarm.id as number, farmData);
    }
    setIsModalOpen(false);
  };

  const handleRemoveFarm = async (farmId: number): Promise<void> => {
    await removeFarm(farmId);
  };
//onClick={() => navigate({ to: "/farm" })}

  return (
    <div className="flex min-h-screen font-sans bg-white">
      {/* Sidebar con fondo gris (bg-gray-200) */}
      <aside className="w-64 bg-gray-300 border-r border-gray-300 flex flex-col">
        <div className="p-4 flex flex-col items-center">
          <img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
          <p className="text-gray-700 font-semibold">Bienvenido, usuario!</p>
        </div>
        {/* Menú de navegación */}
        <nav className="flex-1">
          {/* Grupo 1: "Inicio", "Usuarios" y "Módulos" con mayor separación */}
          <ul className="space-y-20 mt-20">
            <li
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
              onClick={() => navigate({ to: "/newHome" })}
            >
              <img alt="Home" className="h-6 w-6 mr-2" src={homeIcon} />
              <span className="font-bold">Inicio</span>
            </li>
            <li
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105 bg-gray-400 text-white border-2 border-gray-400 rounded-lg"
            >
              <img alt="Usuarios" className="h-6 w-6 mr-2" src={moduleIcon} />
              <span className="font-bold">Granjas</span>
            </li>
            <li
              className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
              onClick={() => navigate({ to: "/report" })}
            >
              <img alt="Módulos" className="h-6 w-6 mr-2" src={reportIcon} />
              <span className="font-bold">Reporte</span>
            </li>
          </ul>

          {/* Grupo 2: "Cerrar Sesión" en un bloque separado */}
          <div className="mt-60">
            <ul className="space-y-4">
              <li className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105">
                <LogoutButton />
              </li>
            </ul>
          </div>
        </nav>
        {/* Footer: Se sube el texto quitando el mt-auto */}
        <div className="p-0">
          <p className="text-center text-xs mt-2">
            versión 1.0 <br /> Advanced Aquaponics Monitoring System
          </p>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Granjas</h1>
        <TableWithActions
          data={farms}
          error={error}
          limit={limit}
          loading={loading}
          page={page}
          setLimit={setLimit}
          setPage={setPage}
          total={total}
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Name', accessor: 'name' },
            { header: 'Latitud', accessor: 'latitude' },
            { header: 'Longitud', accessor: 'longitude' },
            { header: 'Dirección', accessor: 'address' },
            { header: 'Date', accessor: 'createdAt' },
            { 
              header: 'Users', 
              accessor: 'users',
              render: (farm) => farm.users.map((user) => (user as User).name ).join(', ')
            },
          ]}
          onDelete={handleRemoveFarm}
          onAdd={() => {
            setSelectedFarm(null);
            setIsModalOpen(true);
          }}
          onEdit={(farm: FarmRequest) => {
            setSelectedFarm(farm);
            setIsModalOpen(true);
          }}
        />
        {isModalOpen && (
          <FarmModal
            farm={selectedFarm}
            onSave={selectedFarm ? handleEditFarm : handleAddFarm}
            onClose={() => {
              setIsModalOpen(false);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default FarmsPage;