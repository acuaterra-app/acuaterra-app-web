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
    <div>
      <input
        className="mb-4 p-2 border border-gray-300 rounded"
        placeholder={searchPlaceholder}
        type="text"
        value={searchTerm}
        onChange={(_) => { setSearchTerm(_.target.value); }}
      />
      <button
        className="mb-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
        onClick={onAdd}
      >
        Add New
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.accessor)} className="py-2">
                {column.header}
              </th>
            ))}
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <td key={String(column.accessor)} className="py-2">
                  {column.render ? column.render(item) : String(item[column.accessor])}
                </td>
              ))}
              <td className="py-2">
                <button
                  className="bg-primary hover:bg-secondary text-white px-2 py-1 rounded"
                  onClick={() => { onEdit(item); }}
                >
                  Edit
                </button>
                <button
                  className="bg-darkGray hover:bg-veryDark text-white px-2 py-1 rounded ml-2"
                  onClick={() => { onDelete(item.id); }}
                >
                  Delete
                </button>
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