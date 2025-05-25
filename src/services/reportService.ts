const API_BASE_URL: string = import.meta.env["VITE_API_BASE_URL"] as string;

export interface MeasurementParameters {
    moduleId: number;
    startDate: string;
    endDate: string;
    period: string;
    sensorType: string;
    limit?: number;
    token: string;
}

export async function getModuleMeasurements({
    moduleId,
    startDate,
    endDate,
    period,
    sensorType,
    limit = 100,
    token,
}: MeasurementParameters): Promise<unknown> {
    try {
        const url = `${API_BASE_URL}/admin/modules/${moduleId}/measurements?startDate=${startDate}&endDate=${endDate}&period=${period}&sensorType=${sensorType}&limit=${limit}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            // Intenta extraer el error del backend si existe
            let errorMessage = "Network response was not ok";
            try {
                const errorData = (await response.json()) as { message?: string };
                errorMessage = errorData?.message || errorMessage;
            } catch {
                // Error parsing JSON, use default errorMessage
            }
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        // Siempre retorna un objeto consistente para evitar errores en el frontend
        return {
            data: [],
            errors: [error instanceof Error ? error.message : "Unknown error"],
            message: "Error fetching measurements",
            meta: {},
        };
    }
}