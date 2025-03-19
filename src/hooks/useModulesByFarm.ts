import { useState, useEffect } from "react";
import { fetchModulesByFarm } from "../services/moduleService";
import type { ModuleType } from "../common/types";

interface UseModulesByFarmResult {
	modules: Array<ModuleType>;
	loading: boolean;
	error: string | null;
	total: number;
	page: number;
	perPage: number;
	setPage: (page: number) => void;
}

const useModulesByFarm = (
	farmId: number,
	initialPage = 1,
	initialPerPage = 10
): UseModulesByFarmResult => {
	const [modules, setModules] = useState<Array<ModuleType>>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [total, setTotal] = useState<number>(0);
	const [page, setPage] = useState<number>(initialPage);
	const [perPage] = useState<number>(initialPerPage);

	useEffect(() => {
		const fetchModules = async (): Promise<void> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetchModulesByFarm(farmId, page, perPage);
				setModules(response.data);
				setTotal(response.meta.pagination.total);
			} catch (error_) {
				setError((error_ as Error).message);
			} finally {
				setLoading(false);
			}
		};

		if (farmId) {
			fetchModules().catch((error) => {
				console.error("Error fetching modules:", error);
			});
		}
	}, [farmId, page, perPage]);

	return { modules, loading, error, total, page, perPage, setPage };
};

export default useModulesByFarm;
