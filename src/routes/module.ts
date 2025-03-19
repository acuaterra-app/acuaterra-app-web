import { createFileRoute } from "@tanstack/react-router";
import { Module} from "../pages/Module";

export const Route = createFileRoute("/module")({
	component: Module,
});

