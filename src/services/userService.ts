const API_BASE_URL: string = import.meta.env["VITE_API_BASE_URL"] as string;
import type { ResponseType, UserResponse, UserRequestV2 } from "../common/types";

export const fetchUsers = async (page: number, limit: number): Promise<ResponseType<UserResponse>> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_BASE_URL}/admin/users?page=${page}&limit=${limit}`,
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



export const createUser = async (userData: UserRequestV2): Promise<ResponseType<UserResponse>> => {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_BASE_URL}/shared/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json() as Promise<ResponseType<UserResponse>>;
}

export const deleteUser = async (userId: number): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
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

export const updateUser = async (userId: number, userData: UserRequestV2): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/shared/users/${userId}`, {
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