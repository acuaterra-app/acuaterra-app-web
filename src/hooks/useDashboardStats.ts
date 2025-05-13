import { useState, useEffect } from "react";
import { fetchDashboardMetrics, fetchDashboardStats } from "../services/dashboardService";

interface DashboardStats {
  farms: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  modules: {
    labels: string[];
    datasets: { data: number[] }[];
  };
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

interface DashboardMetrics {
    totalFarms: number;
    totalModules: number;
    totalUsers: number;
  }
  
  export const useDashboardMetrics = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchMetrics = async () => {
        setLoading(true);
        try {
          const data = await fetchDashboardMetrics();
          setMetrics(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchMetrics();
    }, []);
  
    return { metrics, loading, error };
  };