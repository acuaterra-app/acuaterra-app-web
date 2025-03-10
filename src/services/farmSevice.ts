const API_BASE_URL: string = import.meta.env["VITE_API_BASE_URL"] as string;
import type { Farm, FarmRequest } from "../common/types";

interface ApiResponse {
    message: string;
    data: Array<Farm>;
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

export const fetchFarms = async (page: number, limit: number): Promise<{ data: Array<Farm>, total: number }> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/admin/farms?page=${page}&perPage=${limit}`, {
        method: "GET",
        headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const data = await response.json() as ApiResponse;
    return { data: data.data, total: data.meta.pagination.total };
};

export const createFarm = async (farmData: FarmRequest): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/farms`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(farmData),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json() as Promise<ApiResponse>;
};

export const deleteFarm = async (farmId: number): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/admin/farms/${farmId}`, {
        method: "DELETE",
        headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json() as Promise<ApiResponse>;
};

export const updateFarm = async (farmId: number, farmData: FarmRequest): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/admin/farms/${farmId}`, {
        method: "PUT",
        headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(farmData),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json() as Promise<ApiResponse>;
};