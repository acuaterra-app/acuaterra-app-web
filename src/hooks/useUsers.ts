import { useState, useEffect } from "react";
import { fetchUsers } from "../services/userService";
import type { UserResponse } from "../common/types";

const useUsers = (
  reload = false,
  initialPage = 1,
  initialLimit = 10,
): {
  users: Array<UserResponse>;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
} => {
  const [users, setUsers] = useState<Array<UserResponse>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  useEffect(() => {
    const fetchUsersData = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetchUsers(page, limit); // gotta check if the API supports pagination
        setUsers(response.data);
        setTotal(response.meta.pagination.total); // User´s total count
        setError(null);
      } catch (error_) {
        console.error("Error fetching users:", error_);
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData().catch((error) => {
      console.error("Error fetching users:", error);
    });
  }, [page, limit, reload]);

  return { users, loading, error, total, page, limit, setPage, setLimit };
};

export default useUsers;