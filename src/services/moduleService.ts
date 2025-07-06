import type {
	ModuleType,
	CreateModuleRequest,
	UpdateModuleRequest,
	ModuleListResponse,
} from "../common/types";

const API_BASE_URL: string = import.meta.env["VITE_API_BASE_URL"] as string;

export const fetchModules = async (): Promise<Array<ModuleType>> => {
	const response = await fetch(`${API_BASE_URL}/modulos/listarModuloMVC`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `${localStorage.getItem("token")}`,
		},
	});
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	const data: Array<ModuleType> = (await response.json()) as Array<ModuleType>
	
	return data;
};

interface ModuleResponse {
	message: string;
}

export const updateModule = async (
	id: number,
	moduleData: UpdateModuleRequest
): Promise<ModuleResponse> => {
	const response = await fetch(`${API_BASE_URL}/modulos/editarModuloMVC/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `${localStorage.getItem("token")}`,
		},
		body: JSON.stringify(moduleData),
	});
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json() as Promise<ModuleResponse>;
};

export const createModule = async (
	moduleData: CreateModuleRequest
): Promise<ModuleResponse> => {
	const response = await fetch(`${API_BASE_URL}/modulos/registerModMVC`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `${localStorage.getItem("token")}`,
		},
		body: JSON.stringify(moduleData),
	});
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json() as Promise<ModuleResponse>;
};

export const deleteModule = async (moduleId: number): Promise<ModuleResponse> => {
	const response = await fetch(`${API_BASE_URL}/modulos/eliminarModuloMVC/${moduleId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `${localStorage.getItem("token")}`,
		},
	});
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json() as Promise<ModuleResponse>;
};

export const fetchModulesByFarm = async (
	farmId: number,
	page: number,
	limit: number
  ): Promise<ModuleListResponse> => {
	const response = await fetch(
	  `${API_BASE_URL}/shared/modules/${farmId}?page=${page}&limit=${limit}`,
	  {
		method: "GET",
		headers: {
		  "Content-Type": "application/json",
		  Authorization: `${localStorage.getItem("token")}`,
		},
	  }
	);
	if (!response.ok) {
	  throw new Error("Failed to fetch modules for the farm");
	}
	return response.json() as Promise<ModuleListResponse>;
  };

// Función para obtener todos los módulos de una granja (para búsquedas globales)
export const fetchAllModulesByFarm = async (farmId: number): Promise<{ data: Array<ModuleType>, total: number }> => {
	const limit = 50; // Límite seguro por página

	// Primero obtenemos la primera página para conocer el total de páginas
	const firstResponse = await fetch(
		`${API_BASE_URL}/shared/modules/${farmId}?page=1&limit=${limit}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `${localStorage.getItem("token")}`,
			},
		}
	);

	if (!firstResponse.ok) {
		throw new Error(`Error al obtener módulos: ${firstResponse.status} ${firstResponse.statusText}`);
	}

	const firstData = await firstResponse.json() as ModuleListResponse;
	const totalPages = firstData.meta.pagination.totalPages;
	let allModules: Array<ModuleType> = [...firstData.data];

	// Si hay más páginas, crear promesas para obtenerlas todas
	if (totalPages > 1) {
		const pagePromises: Array<Promise<Response>> = [];
		
		for (let page = 2; page <= totalPages; page++) {
			pagePromises.push(
				fetch(`${API_BASE_URL}/shared/modules/${farmId}?page=${page}&limit=${limit}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `${localStorage.getItem("token")}`,
					},
				})
			);
		}

		// Ejecutar todas las promesas en paralelo y procesar respuestas
		const responses = await Promise.all(pagePromises);
		const dataPromises = responses.map(async (response) => {
			if (!response.ok) {
				throw new Error(`Error al obtener página de módulos: ${response.status}`);
			}
			return response.json() as Promise<ModuleListResponse>;
		});
		
		const pagesData = await Promise.all(dataPromises);
		
		// Agregar todos los datos de las páginas adicionales
		for (const pageData of pagesData) {
			allModules = [...allModules, ...pageData.data];
		}
	}

	// Ordenar todos los módulos por ID
	const sortedModules = allModules.sort((a, b) => a.id >= b.id ? 1 : -1);
	
	return { 
		data: sortedModules, 
		total: firstData.meta.pagination.total 
	};
};