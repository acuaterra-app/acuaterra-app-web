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
	perPage: number
  ): Promise<ModuleListResponse> => {
	const response = await fetch(
	  `${API_BASE_URL}/shared/modules/${farmId}?page=${page}&perPage=${perPage}`,
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