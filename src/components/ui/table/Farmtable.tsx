import type React from 'react';
import type { Farm, FarmRequest, User } from '../../../common/types';
import ButtonComponent from '../../ui/button/button';

interface FarmTableProps {
  farms: Array<Farm>;
  onEdit: (farm: FarmRequest | Farm) => void;
  onDelete: (farmId: number) => void;
}

const FarmTable: React.FC<FarmTableProps> = ({ farms, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2">Nombre</th>
          <th className="py-2">Dirección</th>
          <th className="py-2">Latitud</th>
          <th className="py-2">Longitud</th>
          <th className="py-2">Usuarios</th>
          <th className="py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {farms.map((farm) => (
          <tr key={farm.id}>
            <td className="py-2">{farm.name}</td>
            <td className="py-2">{farm.address}</td>
            <td className="py-2">{farm.latitude}</td>
            <td className="py-2">{farm.longitude}</td>
            <td className="py-2">{farm.users.map(user => (user as User).name).join(', ')}</td>
            <td className="py-2">
              <ButtonComponent onClick={() => { onEdit(farm); }}>Editar</ButtonComponent>
              <ButtonComponent className="ml-2" onClick={() => { onDelete(farm.id); }}>Eliminar</ButtonComponent>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FarmTable;