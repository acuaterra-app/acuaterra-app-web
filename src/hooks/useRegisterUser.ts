import { useState } from "react";
import type {  UserResponse, ResponseType, UserRequestV2 } from "../common/types";
import { createUser } from "../services/userService";

const useRegisterUser = (): {
    registerUser: (user: UserRequestV2) => Promise<boolean>;
    loading: boolean;
    error: string | null;
} => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const registerUser = async (user: UserRequestV2): Promise<boolean> => {
        try {
            setLoading(true);
            const response: ResponseType<UserResponse> = await createUser(user);
            const userResponse = response.data[0];
            if (response.errors.length === 0 || !userResponse) {
                return await Promise.resolve(true);
            } else {
                setError(response.errors[0] as string);
                return false;
            }
           
        } catch (error) {
            console.error("Error creating user:", error);
            setError("Error creating user");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { registerUser, loading, error };
};

export default useRegisterUser;