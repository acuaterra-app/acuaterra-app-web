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
  isVisibleButton?: boolean ;
  isVisibleActions?: boolean;
  darkMode?: boolean;
  onGlobalSearch?: (searchTerm: string) => void; 
  searchTerm?: string; 
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
  isVisibleButton = true,
  isVisibleActions = true,
  darkMode = false,
  onGlobalSearch,
  searchTerm: controlledSearchTerm,
}: TableWithActionsProps<T>): JSX.Element => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  
  // Usar el término de búsqueda controlado o el local
  const currentSearchTerm = controlledSearchTerm !== undefined ? controlledSearchTerm : localSearchTerm;
  
  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (value: string): void => {
    if (onGlobalSearch) {
      // Si hay callback de búsqueda global, usarlo
      onGlobalSearch(value);
    } else {
      // Si no, usar búsqueda local
      setLocalSearchTerm(value);
    }
  };

  // Filtrar datos solo si NO hay búsqueda global configurada
  // Si hay búsqueda global, los datos ya vienen pre-filtrados desde el componente padre
  const filteredData = onGlobalSearch 
    ? data  // Usar datos tal como vienen (ya filtrados globalmente)
    : data.filter((item) => // Aplicar filtro local solo si no hay búsqueda global
        columns.some((column) =>
          String(item[column.accessor] ?? '')
            .toLowerCase()
            .includes(currentSearchTerm.toLowerCase())
        )
      );

  const totalPages = Math.ceil(total / limit);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-lg shadow-md transition-colors duration-300 border ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-lightGray text-black"
      }`}
    >
      {/* Desktop section:  */}
      <div className="hidden md:block">
        <input
          placeholder={searchPlaceholder}
          type="text"
          value={currentSearchTerm}
          className={`mb-4 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 border-2 ${
            darkMode
              ? "bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-cyan-400 focus:bg-gray-800"
              : "bg-white border-gray-300 text-black placeholder-gray-500 focus:border-primary focus:bg-gray-50"
          } ${currentSearchTerm ? 'ring-2 ring-opacity-30' : ''}`}
          // eslint-disable-next-line unicorn/prevent-abbreviations
          onChange={(e) => { handleSearchChange(e.target.value); }}
        />
        
        {/* Visual feedback when searching */}
        {currentSearchTerm && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`mb-3 p-2 rounded-lg text-sm ${
              darkMode
                ? "bg-cyan-900 text-cyan-200 border border-cyan-700"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            <span className="font-medium">🔍 Buscando:</span> "{currentSearchTerm}" 
            {onGlobalSearch ? (
              <span className="ml-2 text-xs opacity-75">
                (búsqueda en {total} elemento{total !== 1 ? 's' : ''} total{total !== 1 ? 'es' : ''})
              </span>
            ) : filteredData.length > 0 ? (
              <span className="ml-2 text-xs opacity-75">
                ({filteredData.length} resultado{filteredData.length !== 1 ? 's' : ''} en esta página)
              </span>
            ) : (
              <span className="ml-2 text-xs opacity-75">
                (Sin resultados en esta página)
              </span>
            )}
          </motion.div>
        )}
        {isVisibleButton && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded w-full transition font-semibold ${
              darkMode
                ? "bg-cyan-700 text-white hover:bg-cyan-600"
                : "bg-quaternary text-white hover:bg-quinary"
            }`}
            onClick={onAdd}
          >
            Agregar Nuevo Campo
          </motion.button>
        )}
      </div>

      {loading && (
        <p className={`mt-4 text-center ${darkMode ? "text-cyan-400" : "text-primary"}`}>Cargando...</p>
      )}
      {error && (
        <p className={`mt-4 ${darkMode ? "text-red-400" : "text-darkGray"}`}>{error}</p>
      )}

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto mt-4">
        <table className={`min-w-full rounded-lg shadow-md border ${
          darkMode
            ? "bg-gray-900 border-gray-700 text-gray-100"
            : "bg-lightGray border-gray-300 text-black"
        }`}>
          <thead>
            <tr className={darkMode ? "bg-gray-900 text-cyan-400 uppercase text-sm leading-normal" : "bg-primary text-white uppercase text-sm leading-normal"}>
              {columns.map((column) => (
                <th key={String(column.accessor)} className="py-3 px-6 text-left">
                  {column.header}
                </th>
              ))}
              {isVisibleActions && (<th className="py-3 px-6 text-left">Actions</th>)}
            </tr>
          </thead>
          <tbody className={darkMode ? "text-gray-100 text-sm font-light" : "text-gray-600 text-sm font-light"}>
            {filteredData.map((item, index) => (
              <motion.tr
                key={item.id}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                initial={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={`transition-all duration-200 border-b cursor-pointer ${
                  darkMode
                    ? `${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} hover:bg-cyan-900 hover:shadow-lg`
                    : `${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-cyan-50 hover:shadow-lg`
                }`}
              >
                {columns.map((column) => (
                  <td key={String(column.accessor)} className="py-3 px-6 text-left whitespace-nowrap">
                    {column.render ? column.render(item) : String(item[column.accessor] ?? '')}
                  </td>
                ))}
                {isVisibleActions && (
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex space-x-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={`px-2 py-1 rounded flex items-center transition duration-200 ${
                          darkMode
                            ? "bg-cyan-700 hover:bg-cyan-600 text-white"
                            : "bg-primary hover:bg-secondary text-white"
                        }`}
                        onClick={() => { onEdit(item); }}
                      >
                        <FaEdit className="mr-1" /> Editar
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={`px-2 py-1 rounded flex items-center transition duration-200 ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-900 text-white"
                            : "bg-darkGray hover:bg-veryDark text-white"
                        }`}
                        onClick={() => { onDelete(item.id); }}
                      >
                        <FaTrash className="mr-1" /> Borrar
                      </motion.button>
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile section */}
      <div className="md:hidden mt-4">
        <TableWithActionsMobile
          columns={columns}
          darkMode={darkMode}
          data={data}
          error={error}
          isVisibleButton={isVisibleButton}
          limit={limit}
          loading={loading}
          page={page}
          searchPlaceholder={searchPlaceholder}
          searchTerm={controlledSearchTerm}
          setLimit={setLimit}
          setPage={setPage}
          total={total}
          onAdd={onAdd}
          onDelete={onDelete}
          onEdit={onEdit}
          onGlobalSearch={onGlobalSearch}
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
          disabled={page === 1}
          className={`font-semibold py-2 px-4 rounded transition duration-200 ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
              : "bg-gray-300 hover:bg-gray-400 text-gray-700"
          }`}
          onClick={() => { setPage(page - 1); }}
        >
          Previous
        </button>
        <span className={darkMode ? "text-gray-200" : "text-gray-700"}>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          className={`font-semibold py-2 px-4 rounded transition duration-200 ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
              : "bg-gray-300 hover:bg-gray-400 text-gray-700"
          }`}
          onClick={() => { setPage(page + 1); }}
        >
          Next
        </button>
      </motion.div>
    </motion.div>
  );
};

export default TableWithActions;