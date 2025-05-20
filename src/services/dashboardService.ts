const API_BASE_URL: string = import.meta.env["VITE_API_BASE_URL"] as string;

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

interface ApiResponse {
    message: string;
    data: Array<DashboardStats>;
    errors: Array<string>;
    meta: {
        pagination: {
            total: number;
            totalPages: number;
            currentPage: number;
            perPage: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    };
}

interface DashboardMetrics {
    totalFarms: number;
    totalModules: number;
    totalUsers: number;
  }
  
  interface MetricsApiResponse {
    message: string;
    data: Array<DashboardMetrics>;
    errors: Array<string>;
    meta: object;
  }

  interface NotificationStats {
  labels: Array<string>;
  datasets: Array<{
    label: string;
    data: Array<number>;
  }>;
}

interface NotificationApiResponse {
  message: string;
  data: Array<NotificationStats>;
  errors: Array<string>;
  meta: object;
}

export const fetchNotificationStats = async (): Promise<number> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/notifications`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token ? `${token}` : "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notification stats");
  }

  const result = await response.json() as NotificationApiResponse;
  const total = result.data.reduce((accumulator, stat) => {
    const sum = stat.datasets.reduce((dsAccumulator, ds) => dsAccumulator + ds.data.reduce((a, b) => a + b, 0), 0);
    return accumulator + sum;
  }, 0);

  return total;
};


export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token ? `${token}` : "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  const result = await response.json() as ApiResponse;
  console.log("Dashboard stats response:", result); // Debugging line
  if (!result.data || result.data?.length === 0) {
    throw new Error("No data found in the response");
  }

  return result.data[0] as DashboardStats;
};

export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/metrics`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token ? `${token}` : "",
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard metrics");
    }
  
    const result = await response.json() as MetricsApiResponse;
    console.log("Dashboard metrics response:", result); // Debugging line
  
    if (!result.data || result.data.length === 0) {
      throw new Error("No data found in the response");
    }
  
    return result.data[0] as DashboardMetrics;
  };