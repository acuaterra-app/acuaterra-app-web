import { FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import type { TableColumn, TableItem } from '../../../common/types';
import TableWithActionsMobile from './TableWithActionsMobile';
import { motion } from 'framer-motion';

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
  setLimit, 
}: TableWithActionsProps<T>): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((item) =>
    columns.some((column) =>
      String(item[column.accessor] ?? '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border border-lightGray rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {/* Desktop section:  */}
      <div className="hidden md:block">
        <input
          className="mb-4 p-2 border border-lightGray rounded w-full"
          placeholder={searchPlaceholder}
          type="text"
          value={searchTerm}
          // eslint-disable-next-line unicorn/prevent-abbreviations
          onChange={(e) => { setSearchTerm(e.target.value); }}
        />

        <motion.button
          className="bg-quaternary text-white px-6 py-3 rounded hover:bg-quinary transition w-full"
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
        >
          Agregar Nuevo Campo
        </motion.button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-darkGray">{error}</p>}

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto mt-4">
        <table className="min-w-full bg-lightGray border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className=" bg-primary text-white uppercase text-sm leading-normal">
              {columns.map((column) => (
                <th key={String(column.accessor)} className="py-3 px-6 text-left">
                  {column.header}
                </th>
              ))}
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredData.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-gray-200 hover:bg-greenish ${
                  index % 2 === 0 ? 'bg-lightGray' : 'bg-white'
                }`}
              >
                {columns.map((column) => (
                  <td key={String(column.accessor)} className="py-3 px-6 text-left whitespace-nowrap">
                    {column.render ? column.render(item) : String(item[column.accessor] ?? '')}
                  </td>
                ))}
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex space-x-2">
                    <motion.button
                      className="bg-primary hover:bg-secondary text-white px-2 py-1 rounded flex items-center"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { onEdit(item); }}
                    >
                      <FaEdit className="mr-1" /> Editar
                    </motion.button>
                    <motion.button
                      className="bg-darkGray hover:bg-veryDark text-white px-2 py-1 rounded flex items-center"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { onDelete(item.id); }}
                    >
                      <FaTrash className="mr-1" /> Borrar
                    </motion.button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile section */}
      <div className="md:hidden mt-4">
        <TableWithActionsMobile
          columns={columns}
          data={data}
          error={error}
          limit={limit}
          loading={loading}
          page={page}
          searchPlaceholder={searchPlaceholder}
          setLimit={setLimit}
          setPage={setPage}
          total={total}
          onAdd={onAdd}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>

      {/* Pages controller */}
      <motion.div
        animate={{ opacity: 1 }}
        className="flex justify-between items-center mt-4"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
          disabled={page === 1}
          onClick={() => { setPage(page - 1); }}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
          disabled={page === totalPages}
          onClick={() => { setPage(page + 1); }}
        >
          Next
        </button>
      </motion.div>
    </motion.div>
  );
};

export default TableWithActions;
