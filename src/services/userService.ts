const API_BASE_URL: string = import.meta.env["VITE_API_BASE_URL"] as string;
import type { UserRequest, ResponseType, UserResponse } from "../common/types";

export const fetchUsers = async (page: number, limit: number): Promise<ResponseType<UserResponse>> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_BASE_URL}/admin/users?page=${page}&perPage=${limit}`,
        {
            method: "GET",
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
            },
        }
    );
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const result: ResponseType<UserResponse> = await response.json() as ResponseType<UserResponse>;
    return result;
};

interface ModuleResponse {
	message: string;
}

export const createUser = async (userData: UserRequest): Promise<ModuleResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/registerMVC`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json() as Promise<ModuleResponse>;
}

export const deleteUser = async (userId: number): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
};

export const updateUser = async (userId: number, userData: UserRequest): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
};