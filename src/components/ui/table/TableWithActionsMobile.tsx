import { FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TableColumn, TableItem } from '../../../common/types';

interface TableWithActionsMobileProps<T extends TableItem> {
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
  isVisibleButton?: boolean;
  isVisibleActions?: boolean;
  darkMode?: boolean; // <-- Añade esta prop
}

const TableWithActionsMobile = <T extends TableItem>({
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  loading,
  error,
  searchPlaceholder = 'Buscar...',
  total,
  page,
  limit,
  setPage,
  isVisibleButton = true,
  isVisibleActions = true,
  darkMode = false, // <-- Valor por defecto
}: TableWithActionsMobileProps<T>): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((item) =>
    columns.some((column) =>
      String(item[column.accessor] ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <motion.div 
      animate={{ opacity: 1, scale: 1 }} 
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`p-4 border rounded-lg shadow-md transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-gray-300 text-black"
      }`}
    >
      {/* Input  */}
      <input
        placeholder={searchPlaceholder}
        type="text"
        value={searchTerm}
        className={`mb-4 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 ${
          darkMode
            ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400"
            : "bg-white border-gray-300 text-black"
        }`}
        // eslint-disable-next-line unicorn/prevent-abbreviations
        onChange={(e) => { setSearchTerm(e.target.value); }}
      />

      {/* Button */}
      {isVisibleButton && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`px-4 py-2 rounded w-full cursor-pointer transition duration-200 ${
            darkMode
              ? "bg-cyan-700 text-white hover:bg-cyan-600"
              : "bg-quaternary text-white hover:bg-quinary"
          }`}
          onClick={onAdd}
        >
          Agregar Nuevo
        </motion.button>
      )}

      {loading && (
        <p className={`text-center mt-4 ${darkMode ? "text-cyan-400" : "text-primary"}`}>Cargando...</p>
      )}
      {error && (
        <p className={`${darkMode ? "text-red-400" : "text-red-500"} mt-4`}>{error}</p>
      )}

      {/* table with format in cards */}
      <div className="mt-4 space-y-4">
        {filteredData.map((item, index) => (
          <motion.div 
            key={item.id}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`p-4 border rounded-lg shadow-sm transition-colors duration-200 ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100"
                : "bg-lightGray border-gray-300 text-black"
            }`}
          >
            {columns.map((column) => (
              <div key={String(column.accessor)} className="mb-2">
                <strong className={darkMode ? "text-cyan-400" : "text-primary"}>
                  {column.header}:
                </strong>
                <span className="truncate block">
                  {column.render ? column.render(item) : String(item[column.accessor] ?? '')}
                </span>
              </div>
            ))}
            {/* Buttons */}
            {isVisibleActions && (
              <div className="flex space-x-2 mt-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={`px-3 py-1 rounded flex items-center transition duration-200 cursor-pointer ${
                    darkMode
                      ? "bg-cyan-700 hover:bg-cyan-600 text-white"
                      : "bg-primary hover:bg-secondary text-white"
                  }`}
                  onClick={() => { onEdit(item); }}
                >
                  <FaEdit className="mr-1" /> Editar
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={`px-3 py-1 rounded flex items-center transition duration-200 cursor-pointer ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-900 text-white"
                      : "bg-darkGray hover:bg-veryDark text-white"
                  }`}
                  onClick={() => { onDelete(item.id); }}
                >
                  <FaTrash className="mr-1" /> Borrar
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Paginatión */}
      <div className="flex justify-between items-center mt-4">
        <motion.button
          disabled={page === 1}
          whileTap={{ scale: 0.9 }}
          className={`font-semibold py-2 px-4 rounded transition duration-200 cursor-pointer ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
              : "bg-gray-300 hover:bg-gray-400 text-gray-700"
          }`}
          onClick={() => { setPage(page - 1); }}
        >
          Anterior
        </motion.button>
        <span className={darkMode ? "text-gray-200" : "text-gray-700"}>
          Página {page} de {totalPages}
        </span>
        <motion.button
          disabled={page === totalPages}
          whileTap={{ scale: 0.9 }}
          className={`font-semibold py-2 px-4 rounded transition duration-200 cursor-pointer ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
              : "bg-gray-300 hover:bg-gray-400 text-gray-700"
          }`}
          onClick={() => { setPage(page + 1); }}
        >
          Siguiente
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TableWithActionsMobile;