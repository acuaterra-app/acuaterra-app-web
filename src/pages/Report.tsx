import { useState, useEffect } from "react";
// eslint-disable-next-line no-duplicate-imports
import type { FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import acuaterraLogo from "../assets/images/logo.png";
import homeIcon from "../assets/images/home.png";
import reporteIcon from "../assets/images/reporte.png";
import moduleIcon from "../assets/images/module.png";
import userIcon from "../assets/images/userlogo.png";
import fishIcon from "../assets/images/pez.png";

import LoaderAcua from "../components/loaders/LoaderAcua";
import LogoutButton from "../components/ui/button/logoutButton";
import { isTokenValid } from "../common/isTokenValid";
import SensorChart from "../components/charts/line/SensorChart";

const Report: FC = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
	const sensorLabels = ["10:00", "10:05", "10:10", "10:15", "10:20"];
	const sensorData = [20, 25, 22, 30, 28];
	const weeklyLabels = [
		"Lunes",
		"Martes",
		"Miércoles",
		"Jueves",
		"Viernes",
		"Sábado",
		"Domingo",
	];
	const weeklyData = [25, 28, 22, 30, 26, 24, 27]; // dayly averages

	const monthlyLabels = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	];
	const monthlyData = [22, 24, 26, 28, 30, 32, 34, 33, 31, 29, 27, 25]; // weekly averages

	useEffect(() => {
		if (!isTokenValid()) {
			console.log("Redirigiendo a /auth desde el componente Report");
			void navigate({ to: "/auth" });
		}
	}, [navigate]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 2000);

		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		return () => {
			clearTimeout(timer);
		};
	}, []);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		const handleClickOutside = (event: MouseEvent) => {
			const sidebar = document.getElementById("sidebar");
			const menuButton = document.getElementById("menu-button");

			if (
				isOpen &&
				sidebar &&
				!sidebar.contains(event.target as Node) &&
				menuButton &&
				!menuButton.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	useEffect(() => {
		document.body.style.overflowY = isOpen ? "hidden" : "auto";
		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		return () => {
			document.body.style.overflowY = "auto";
		};
	}, [isOpen]);

	return (
		<div className="flex min-h-screen bg-white font-sans relative overflow-x-auto">
			<button
				className="absolute top-4 left-4 z-50 bg-gray-300 p-2 rounded shadow-md md:hidden"
				id="menu-button"
				onClick={() => {
					setIsOpen(!isOpen);
				}}
			>
				{isOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			<aside
				id="sidebar"
				className={`fixed top-0 left-0 w-64 h-screen bg-gray-300 border-r border-gray-300 flex flex-col transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:w-64 md:relative`}
			>
				<div className="p-4 flex flex-col items-center relative">
					<button
						className="absolute top-2 right-2 p-2 text-gray-700 hover:text-gray-900 md:hidden"
						onClick={() => {
							setIsOpen(false);
						}}
					>
						<X size={24} />
					</button>
					<img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
					<p className="text-gray-700 font-semibold">Bienvenido, usuario!</p>
				</div>

				<nav className="flex-1">
					<ul className="space-y-3 md:space-y-20 mt-4 md:mt-20">
						<li
							className="
                flex items-center justify-center gap-3 p-2
                cursor-pointer transition-all duration-300
                transform origin-center overflow-hidden
                hover:bg-gray-400 hover:scale-102
                rounded-lg
              "
							onClick={async () => {
								await navigate({ to: "/newHome" });
								setIsOpen(false);
							}}
						>
							<img alt="Inicio" className="h-6 w-6" src={homeIcon} />
							<span className="font-bold">Inicio</span>
						</li>
						<li
							className="
                flex items-center justify-center gap-3 p-2
                cursor-pointer transition-all duration-300
                transform origin-center overflow-hidden
                hover:bg-gray-400 hover:scale-102
                rounded-lg
              "
							onClick={async () => {
								await navigate({ to: "/farm" });
								setIsOpen(false);
							}}
						>
							<img alt="Granjas" className="h-6 w-6" src={moduleIcon} />
							<span className="font-bold">Granjas</span>
						</li>
						<li
							className="
                flex items-center justify-center gap-3 p-2
                cursor-pointer transition-all duration-300
                transform origin-center overflow-hidden
                hover:bg-gray-400 hover:scale-102
                rounded-lg
              "
							onClick={async () => {
								await navigate({ to: "/users" });
								setIsOpen(false);
							}}
						>
							<img alt="Usuarios" className="h-6 w-6" src={userIcon} />
							<span className="font-bold">Usuarios</span>
						</li>
						<li
							className="
                flex items-center justify-center gap-3 p-2
                cursor-pointer transition-all duration-300
                transform origin-center overflow-hidden
                hover:bg-gray-400 hover:scale-102
                rounded-lg
              "
							onClick={async () => {
								await navigate({ to: "/module" });
								setIsOpen(false);
							}}
						>
							<img alt="Módulos" className="h-6 w-6" src={fishIcon} />
							<span className="font-bold">Módulos</span>
						</li>
						<li
							className="
                flex items-center justify-center gap-3 p-2
                cursor-pointer transition-all duration-300
                transform origin-center overflow-hidden
                hover:bg-gray-400 hover:scale-102
                bg-gray-400 text-white border-2 border-gray-400
                rounded-lg
              "
						>
							<img alt="Reporte" className="h-6 w-6" src={reporteIcon} />
							<span className="font-bold">Reporte</span>
						</li>
					</ul>

					<div className="mt-4 md:mt-20">
						<ul className="space-y-4">
							<li
								className="
                  flex items-center justify-center gap-3 p-2
                  cursor-pointer transition-all duration-300
                  transform origin-center overflow-hidden
                  hover:bg-gray-300 hover:scale-102
                  rounded-lg
                "
							>
								<LogoutButton />
							</li>
						</ul>
					</div>

					<div className="mt-4 md:mt-20">
						<ul className="space-y-4"></ul>
					</div>
				</nav>

				<div className="p-0">
					<p className="text-center text-xs mt-2">
						versión 1.0 <br /> Advanced Aquaponics Monitoring System
					</p>
				</div>
			</aside>

			<main className="flex-1 p-6 bg-white">
				{loading ? (
					<LoaderAcua />
				) : (
					<>
						<h1 className="text-2xl font-bold mb-4 text-center">Reportes</h1>
						<p className="text-gray-600 mb-6 text-center">
							Visualización y generación de reportes.
						</p>
						{/* Sensor graphics in real time */}
						<div className="mt-8">
							<h2 className="text-xl font-semibold mb-4 text-center">
								Comportamiento en Tiempo Real
							</h2>
							<SensorChart
								color="rgba(75, 192, 192, 1)"
								data={sensorData}
								labels={sensorLabels}
							/>
						</div>

						{/* weekly graphics */}
						<div className="mt-8">
							<h2 className="text-xl font-semibold mb-4 text-center">
								Comportamiento Semanal
							</h2>
							<SensorChart
								color="rgba(255, 99, 132, 1)"
								data={weeklyData}
								labels={weeklyLabels}
							/>
						</div>

						{/* Monthly graphics  */}
						<div className="mt-8">
							<h2 className="text-xl font-semibold mb-4 text-center">
								Comportamiento Mensual
							</h2>
							<SensorChart
								color="rgba(54, 162, 235, 1)"
								data={monthlyData}
								labels={monthlyLabels}
							/>
						</div>
					</>
				)}
			</main>
		</div>
	);
};

export default Report;
