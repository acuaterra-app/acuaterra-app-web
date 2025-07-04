import { useState } from "react";
import type {  UserResponse, ResponseType, UserRequestV2 } from "../common/types";
import { createUser } from "../services/userService";

export interface BackendFieldError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

export interface BackendErrorResponse {
  message: string;
  data: Array<unknown>;
  errors: Array<BackendFieldError>;
  meta: Record<string, unknown>;
}

const useRegisterUser = (): {
    registerUser: (user: UserRequestV2) => Promise<{ success: boolean; errors?: Array<BackendFieldError>; message?: string }>;
    loading: boolean;
    error: string;
} => {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const registerUser = async (
        user: UserRequestV2
    ): Promise<{ success: boolean; message?: string }> => {
        try {
            setLoading(true);
            const response: ResponseType<UserResponse> = await createUser(user);
            const userResponse = response.data as unknown as UserResponse;
            if (response.errors.length === 0 && userResponse) {
                setError("");
                return { success: true };
            } else {
                setError(response.errors[0] as string);
                return { success: false, message: "Error al crear el usuario" };
            }
           
        } catch (error: unknown) {
            console.error("Error creating user:", error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Error al crear el usuario");
            }
            
            return { 
                success: false, 
                message: (typeof error === "object" && error !== null && "message" in error && typeof (error as { message?: unknown }).message === "string")
                    ? (error as { message: string }).message
                    : "Error al crear el usuario"
            };
        } finally {
            setLoading(false);
        }
    };

    return { registerUser, loading, error };
};

export default useRegisterUser;