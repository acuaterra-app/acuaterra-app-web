import { createFileRoute } from "@tanstack/react-router";
import { Module } from "../pages/Module";
import { authGuard } from "../common/isTokenValid";

export const Route = createFileRoute("/module")({
	component: Module,
	beforeLoad: authGuard,
});

