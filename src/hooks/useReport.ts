/* eslint-disable unicorn/prevent-abbreviations */
import { useState, useEffect } from "react";
import type { MeasurementParameters } from "../services/reportService";
// eslint-disable-next-line no-duplicate-imports
import { getModuleMeasurements } from "../services/reportService";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function useReport(params: Omit<MeasurementParameters, "token"> & { enabled?: boolean }) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>({ data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.enabled || !params.moduleId) {
      setData({ data: [] });
      setError(null);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setData({ data: [] });
      return;
    }

    setLoading(true);
    setError(null);

    getModuleMeasurements({ ...params, token })
      .then((res: unknown) => {
        // Si la respuesta tiene un array data, úsalo, si no, retorna vacío
        if (res && Array.isArray((res as { data: Array<unknown> }).data)) {
          setData(res);
          setError(
            (res as { errors?: Array<string> }).errors && (res as { errors?: Array<string> }).errors!.length > 0
              ? (res as { errors?: Array<string> }).errors![0] ?? null
              : null
          );
        } else {
          setData({ data: [] });
          setError("No data received");
        }
      })
      .catch((err: unknown) => {
        setData({ data: [] });
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => { setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.moduleId,
    params.startDate,
    params.endDate,
    params.period,
    params.sensorType,
    params.enabled,
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { data, loading, error };
}

export default useReport;