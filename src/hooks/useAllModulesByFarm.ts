import { useState, useEffect } from 'react';
import { fetchAllModulesByFarm } from '../services/moduleService';
import type { ModuleType } from '../common/types';

interface UseAllModulesByFarmResult {
  allModules: Array<ModuleType>;
  filteredModules: Array<ModuleType>;
  paginatedModules: Array<ModuleType>; // Nuevos módulos paginados
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  total: number;
  filteredTotal: number; // Total de módulos filtrados para paginación correcta
  page: number; // Página actual para paginación local
  perPage: number; // Elementos por página
  setPage: (page: number) => void; // Setter para cambiar página
  totalPages: number; // Total de páginas basado en módulos filtrados
}

const useAllModulesByFarm = (farmId: number): UseAllModulesByFarmResult => {
  const [allModules, setAllModules] = useState<Array<ModuleType>>([]);
  const [filteredModules, setFilteredModules] = useState<Array<ModuleType>>([]);
  const [paginatedModules, setPaginatedModules] = useState<Array<ModuleType>>([]); // Estado para módulos paginados
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1); // Página actual para paginación local
  const [perPage] = useState<number>(10); // Elementos por página

  // Cargar todos los módulos cuando cambia la granja
  useEffect(() => {
    const fetchModules = async (): Promise<void> => {
      if (!farmId) {
        setAllModules([]);
        setFilteredModules([]);
        setTotal(0);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetchAllModulesByFarm(farmId);
        setAllModules(response.data);
        setFilteredModules(response.data);
        setTotal(response.total);
      } catch (error_) {
        setError((error_ as Error).message);
        console.error('Error fetching all modules:', error_);
      } finally {
        setLoading(false);
      }
    };

    void fetchModules();
  }, [farmId]);

  // Filtrar módulos cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredModules(allModules);
    } else {
      const filtered = allModules.filter((module) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          module.name.toLowerCase().includes(searchLower) ||
          module.location.toLowerCase().includes(searchLower) ||
          module.species_fish.toLowerCase().includes(searchLower) ||
          module.dimensions.toLowerCase().includes(searchLower) ||
          module.creator.name.toLowerCase().includes(searchLower) ||
          module.farm.name.toLowerCase().includes(searchLower) ||
          module.id.toString().includes(searchLower) ||
          module.fish_quantity.toString().includes(searchLower)
        );
      });
      setFilteredModules(filtered);
    }
    
    // Resetear a la primera página cuando cambia el filtro
    setPage(1);
  }, [searchTerm, allModules]);

  // Paginación local de los módulos filtrados
  useEffect(() => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginated = filteredModules.slice(startIndex, endIndex);
    setPaginatedModules(paginated);
  }, [filteredModules, page, perPage]);

  // Calcular el total de páginas basado en los módulos filtrados
  const totalPages = Math.ceil(filteredModules.length / perPage);
  const filteredTotal = filteredModules.length;

  return {
    allModules,
    filteredModules,
    paginatedModules,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    total,
    filteredTotal,
    page,
    perPage,
    setPage,
    totalPages
  };
};

export default useAllModulesByFarm;
