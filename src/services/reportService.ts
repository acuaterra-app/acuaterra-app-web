const API_BASE_URL: string = import.meta.env["VITE_API_BASE_URL"] as string;

export interface MeasurementParams {
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
}: MeasurementParams) {
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
        throw new Error("Network response was not ok");
    }
    return response.json();
}