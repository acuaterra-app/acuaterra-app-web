import type React from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState } from "react";
import useFarms from "../hooks/useFarms";
import FarmTable from "../components/ui/table/Farmtable";
import FarmModal from "../components/ui/modals/FarmModal";
import ButtonComponent from "../components/ui/button/button";
import type { FarmRequest } from "../common/types";

const FarmsPage: React.FC = () => {
  const { farms, loading, error, addFarm, editFarm, removeFarm, total, limit, page, setLimit, setPage } = useFarms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<FarmRequest | null>(null);

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Granjas</h1>
      <ButtonComponent
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Agregar Granja
      </ButtonComponent>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <FarmTable
        farms={farms}
        limit={limit}
        page={page}
        setLimit={setLimit}
        setPage={setPage}
        total={total}
        onDelete={handleRemoveFarm}
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
    </div>
  );
};

export default FarmsPage;