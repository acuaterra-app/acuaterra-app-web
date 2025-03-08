import type React from 'react';
import type { Farm, FarmRequest, User } from '../../../common/types';
import ButtonComponent from '../../ui/button/button';

interface FarmTableProps {
  farms: Array<Farm>;
  onEdit: (farm: FarmRequest | Farm) => void;
  onDelete: (farmId: number) => void;
  total: number;
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

const FarmTable: React.FC<FarmTableProps> = ({ farms, onEdit, onDelete, total, page, limit, setPage, setLimit }) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div>
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
      <div className="flex justify-between items-center mt-4">
        <div>
          <label>
            Mostrar
            <select className="ml-2" value={limit} onChange={(_) => { setLimit(Number(_.target.value)); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            entradas
          </label>
        </div>
        <div>
          <button className="px-4 py-2 bg-gray-300 rounded mr-2" disabled={page === 1} onClick={() => { setPage(page - 1); }}>
            Anterior
          </button>
          <span>Página {page} de {totalPages}</span>
          <button className="px-4 py-2 bg-gray-300 rounded ml-2" disabled={page === totalPages} onClick={() => { setPage(page + 1); }}>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmTable;