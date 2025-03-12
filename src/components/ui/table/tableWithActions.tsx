import { FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import type { TableColumn, TableItem } from '../../../common/types';

interface TableWithActionsProps<T extends TableItem> {
  data: Array<T>;
  columns: Array<TableColumn<T>>;
  onEdit: (item: T) => void;
  onDelete: (itemId: number) => void;
  onAdd: () => void;
  loading: boolean;
  error: string | null;
  searchPlaceholder?: string;
  total: number;
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

const TableWithActions = <T extends TableItem>({
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  loading,
  error,
  searchPlaceholder = 'Search...',
  total,
  page,
  limit,
  setPage,
}: TableWithActionsProps<T>): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((item) =>
    columns.some((column) =>
      String(item[column.accessor]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-md">
      <input
        className="mb-4 p-2 border border-gray-300 rounded"
        placeholder={searchPlaceholder}
        type="text"
        value={searchTerm}
        onChange={(_) => { setSearchTerm(_.target.value); }}
      />
      
      <button
        className="bg-quaternary text-white px-6 py-3 rounded hover:bg-quinary transition"
        onClick={onAdd}
      >
        Agregar Nuevo Campo
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md mt-4">
        <thead>
          <tr className="bg-primary text-white uppercase text-sm leading-normal">
            {columns.map((column) => (
              <th key={String(column.accessor)} className="py-3 px-6 text-left">{column.header}</th>
            ))}
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {filteredData.map((item, index) => (
            <tr key={item.id} className={`border-b border-gray-200 hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              {columns.map((column) => (
                <td key={String(column.accessor)} className="py-3 px-6 text-left whitespace-nowrap">
                  {column.render ? column.render(item) : String(item[column.accessor])}
                </td>
              ))}
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex space-x-2">
                  <button
                    className="bg-primary hover:bg-secondary text-white px-2 py-1 rounded flex items-center"
                    onClick={() => { onEdit(item); }}
                  >
                    <FaEdit className="mr-1" /> Editar
                  </button>
                  <button
                    className="bg-darkGray hover:bg-veryDark text-white px-2 py-1 rounded flex items-center"
                    onClick={() => { onDelete(item.id); }}
                  >
                    <FaTrash className="mr-1" /> Borrar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
          disabled={page === 1}
          onClick={() => { setPage(page - 1); }}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
          disabled={page === totalPages}
          onClick={() => { setPage(page + 1); }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableWithActions;