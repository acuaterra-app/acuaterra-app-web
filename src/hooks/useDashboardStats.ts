import { useState, useEffect } from "react";
import { fetchDashboardMetrics, fetchDashboardStats, fetchNotificationStats } from "../services/dashboardService";

interface DashboardStats {
  farms: {
    labels: Array<string>;
    datasets: Array<{ data: Array<number> }>;
  };
  modules: {
    labels: Array<string>;
    datasets: Array<{ data: Array<number> }>;
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error_) {
        setError((error_ as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void fetchStats();
  }, []);

  return { stats, loading, error };
};

interface DashboardMetrics {
    totalFarms: number;
    totalModules: number;
    totalUsers: number;
  }
  
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  export const useDashboardMetrics = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const fetchMetrics = async () => {
        setLoading(true);
        try {
          const data = await fetchDashboardMetrics();
          setMetrics(data);
        } catch (error_) {
          setError((error_ as Error).message);
        } finally {
          setLoading(false);
        }
      };
  
      void fetchMetrics();
    }, []);
  
    return { metrics, loading, error };
  };


interface UseNotificationStatsResult {
  totalNotifications: number | null;
  loading: boolean;
  error: string | null;
}

export const useNotificationStats = () : UseNotificationStatsResult => {
  const [totalNotifications, setTotalNotifications] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchStats = async () => {
      setLoading(true);
      try {
        const total = await fetchNotificationStats();
        setTotalNotifications(total);
      } catch (error_) {
        setError((error_ as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void fetchStats();
  }, []);

  return { totalNotifications, loading, error };
};