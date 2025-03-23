import { useState, useEffect } from 'react';
import { fetchFarms, createFarm, updateFarm, deleteFarm } from '../services/farmSevice';
import type { Farm, FarmRequest } from '../common/types';

const useFarms = (initialPage = 1, initialLimit = 10): {
  farms: Array<Farm>,
  loading: boolean,
  error: string | null,
  total: number,
  page: number,
  limit: number,
  setPage: (page: number) => void,
  setLimit: (limit: number) => void,
  addFarm: (farmData: FarmRequest) => Promise<boolean>,
  editFarm: (farmId: number, farmData: FarmRequest) => Promise<void>,
  removeFarm: (farmId: number) => Promise<void>
} => {
  const [farms, setFarms] = useState<Array<Farm>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      setError(null); // Limpia el error antes de cargar los datos
      try {
        const { data, total } = await fetchFarms(page, limit);
        setFarms(data);
        setTotal(total);
      } catch (error_) {
        setError('Error al cargar las granjas');
        console.error(error_);
      } finally {
        setLoading(false);
      }
    };

    fetchData().catch((error) => {
      console.error('Error fetching farms:', error);
    });
  }, [page, limit]);

  const addFarm = async (farmData: FarmRequest): Promise<boolean> => {
    setError(null); // Limpia el error antes de agregar
    try {
      const response = await createFarm(farmData);
      const Farm = response.data[0];
      if (response.errors.length === 0 || !Farm) {
        setFarms([...farms, Farm as Farm]);
        return await Promise.resolve(true);
      } else {
        setError(response.errors[0] as string);
        return false;
      }
    } catch (error_) {
      setError('Error al agregar la granja');
      console.error(error_);
      return false;
    }
  };

  const editFarm = async (farmId: number, farmData: FarmRequest): Promise<void> => {
    setError(null); // Limpia el error antes de editar
    try {
      const response = await updateFarm(farmId, farmData);
      const responseFarm = response.data[0];
      if (response.errors.length === 0) {
        setFarms(farms.map(farm => (farm.id === farmId ? responseFarm : farm)) as Array<Farm>);
      } else {
        setError(response.errors[0] as string);
      }
    } catch (error_) {
      setError('Error al editar la granja');
      console.error(error_);
    }
  };

  const removeFarm = async (farmId: number): Promise<void> => {
    setError(null); // Limpia el error antes de eliminar
    try {
      const response = await deleteFarm(farmId);
      if (response.errors.length === 0) {
        setFarms(farms.filter(farm => farm.id !== farmId));
      } else {
        setError(response.errors[0] as string);
      }
    } catch (error_) {
      setError('Error al eliminar la granja');
      console.error(error_);
    }
  };

  return { farms, loading, error, total, page, limit, setPage, setLimit, addFarm, editFarm, removeFarm };
};

export default useFarms;