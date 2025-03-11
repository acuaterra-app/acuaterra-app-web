import { useState } from "react";
// eslint-disable-next-line no-duplicate-imports
import type { FunctionComponent } from "react";
import useFarms from "../hooks/useFarms";
import TableWithActions from "../components/ui/table/tableWithActions";
import FarmModal from "../components/ui/modals/FarmModal";
import type { FarmRequest, User } from "../common/types";
import Layout from "../components/layout/layout";

const FarmsPage: FunctionComponent = () => {
  const { farms, loading, error, total, page, limit, setPage, setLimit, addFarm, editFarm, removeFarm } = useFarms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<FarmRequest | null>(null);

  const handleAddFarm = async (farmData: FarmRequest): Promise<void> => {
    await addFarm(farmData);
    setIsModalOpen(false);
  };

  const handleEditFarm = async (farmData: FarmRequest): Promise<void> => {
    if (selectedFarm) {
      const userIds = farmData.users.map((user) => (typeof user === 'object' ? user.id : user));
      const updatedFarmData = { ...farmData, users: userIds };
      await editFarm(selectedFarm.id as number, updatedFarmData);
    }
    setIsModalOpen(false);
  };

  const handleRemoveFarm = async (farmId: number): Promise<void> => {
    await removeFarm(farmId);
  };

  return (
    <Layout>
      <div className="p-4">
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
      </div>
    </Layout>
  );
};

export default FarmsPage;