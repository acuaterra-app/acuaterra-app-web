import { useState } from "react";
import { updateUser } from "../services/userService";
import type { UserRequestV2 } from "../common/types";

const useUpdateUser = ():{
    updateUserHandler: (userId: number, userData: UserRequestV2) => Promise<void>;
    loading: boolean;
    error: string | null;
}  => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserHandler = async (userId: number, userData: UserRequestV2): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await updateUser(userId, userData);
    } catch (error_) {
      setError((error_ as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { updateUserHandler, loading, error };
};

export default useUpdateUser;