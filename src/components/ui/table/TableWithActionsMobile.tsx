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
      className="p-4 border border-gray-300 rounded-lg shadow-md bg-white" 
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {/* Input  */}
      <input
        className="mb-4 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder={searchPlaceholder}
        type="text"
        value={searchTerm}
        // eslint-disable-next-line unicorn/prevent-abbreviations
        onChange={(e) => { setSearchTerm(e.target.value); }}
      />

      {/* Button*/}
      { isVisibleButton && (<motion.button
        className="bg-quaternary text-white px-4 py-2 rounded hover:bg-quinary transition duration-200 w-full cursor-pointer"
        whileTap={{ scale: 0.9 }}
        onClick={onAdd}
      >
        Agregar Nuevo
      </motion.button>) }
      
      

      {loading && <p className="text-center mt-4 text-primary">Cargando...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      {/* table with format in cards */}
      <div className="mt-4 space-y-4">
        {filteredData.map((item, index) => (
          <motion.div 
            key={item.id} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-4 border border-gray-300 rounded-lg shadow-sm bg-lightGray"
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {columns.map((column) => (
              <div key={String(column.accessor)} className="mb-2">
                <strong className="text-primary">{column.header}:</strong> 
                <span className="truncate block">{column.render ? column.render(item) : String(item[column.accessor] ?? '')}</span>
              </div>
            ))}
            {/* Buttons */}
            
            {isVisibleActions && (<div className="flex space-x-2 mt-2">
              <motion.button
                className="bg-primary hover:bg-secondary text-white px-3 py-1 rounded flex items-center transition duration-200 cursor-pointer"
                whileTap={{ scale: 0.9 }}
                onClick={() => { onEdit(item); }}
              >
                <FaEdit className="mr-1" /> Editar
              </motion.button>
              <motion.button
                className="bg-darkGray hover:bg-veryDark text-white px-3 py-1 rounded flex items-center transition duration-200 cursor-pointer"
                whileTap={{ scale: 0.9 }}
                onClick={() => { onDelete(item.id); }}
              >
                <FaTrash className="mr-1" /> Borrar
              </motion.button>
            </div>)}

          </motion.div>
        ))}
      </div>

      {/* Paginatión */}
      <div className="flex justify-between items-center mt-4">
        <motion.button
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded transition duration-200 cursor-pointer"
          disabled={page === 1}
          whileTap={{ scale: 0.9 }}
          onClick={() => { setPage(page - 1); }}
        >
          Anterior
        </motion.button>
        <span className="text-center">
          Página {page} de {totalPages}
        </span>
        <motion.button
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded transition duration-200 cursor-pointer"
          disabled={page === totalPages}
          whileTap={{ scale: 0.9 }}
          onClick={() => { setPage(page + 1); }}
        >
          Siguiente
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TableWithActionsMobile;
