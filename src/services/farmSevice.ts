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
    const response = await fetch(`${API_BASE_URL}/admin/farms?page=${page}&limit=${limit}`, {
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
    return { data: data.data.sort((itema, itemb) => itema.id >= itemb.id ? 1 : -1),  total: data.meta.pagination.total };
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

// Función para obtener todas las granjas disponibles (para selectores)
export const fetchAllFarms = async (): Promise<{ data: Array<Farm>, total: number }> => {
    const token = localStorage.getItem("token");
    const limit = 50; // Límite seguro por página

    // Primero obtenemos la primera página para conocer el total de páginas
    const firstResponse = await fetch(`${API_BASE_URL}/admin/farms?page=1&limit=${limit}`, {
        method: "GET",
        headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!firstResponse.ok) {
        throw new Error(`Error al obtener granjas: ${firstResponse.status} ${firstResponse.statusText}`);
    }

    const firstData = await firstResponse.json() as ApiResponse;
    const totalPages = firstData.meta.pagination.totalPages;
    let allFarms: Array<Farm> = [...firstData.data];

    // Si hay más páginas, crear promesas para obtenerlas todas
    if (totalPages > 1) {
        const pagePromises: Array<Promise<Response>> = [];
        
        for (let page = 2; page <= totalPages; page++) {
            pagePromises.push(
                fetch(`${API_BASE_URL}/admin/farms?page=${page}&limit=${limit}`, {
                    method: "GET",
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                })
            );
        }

        // Ejecutar todas las promesas en paralelo y procesar respuestas
        const responses = await Promise.all(pagePromises);
        const dataPromises = responses.map(async (response) => {
            if (!response.ok) {
                throw new Error(`Error al obtener página de granjas: ${response.status}`);
            }
            return response.json() as Promise<ApiResponse>;
        });
        
        const pagesData = await Promise.all(dataPromises);
        
        // Agregar todos los datos de las páginas adicionales
        for (const pageData of pagesData) {
            allFarms = [...allFarms, ...pageData.data];
        }
    }

    // Ordenar todas las granjas por ID
    const sortedFarms = allFarms.sort((itema, itemb) => itema.id >= itemb.id ? 1 : -1);
    
    return { 
        data: sortedFarms, 
        total: firstData.meta.pagination.total 
    };
};