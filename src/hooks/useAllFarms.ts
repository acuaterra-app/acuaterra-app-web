import { useState, useEffect } from 'react';
import { fetchAllFarms } from '../services/farmSevice';
import type { Farm } from '../common/types';

const useAllFarms = (): {
  farms: Array<Farm>,
  loading: boolean,
  error: string | null
} => {
  const [farms, setFarms] = useState<Array<Farm>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchAllFarms();
        setFarms(data);
      } catch (error_) {
        setError('Error al cargar las granjas');
        console.error('Error fetching all farms:', error_);
      } finally {
        setLoading(false);
      }
    };

    fetchData().catch((error) => {
      console.error('Error in useAllFarms fetchData:', error);
    });
  }, []);

  return { farms, loading, error };
};

export default useAllFarms;
