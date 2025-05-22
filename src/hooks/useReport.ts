import { useState, useEffect } from "react";
import { getModuleMeasurements, MeasurementParams } from "../services/reportService";

export function useReport(params: Omit<MeasurementParams, "token"> & { enabled?: boolean }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!params.enabled) return;
    if (!params.moduleId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    setLoading(true);
    getModuleMeasurements({ ...params, token })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [params.moduleId, params.startDate, params.endDate, params.period, params.sensorType, params.enabled]);

  return { data, loading, error };
}

export default useReport;