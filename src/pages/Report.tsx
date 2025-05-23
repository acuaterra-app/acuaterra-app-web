/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState, useEffect, useRef } from "react";
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
import styled from "styled-components";
import SideBar from "../components/ui/sidebar/SideBar";
import FarmModuleSelector from "../components/ui/selects/farmModuleSelectot";
import useReport from "../hooks/useReport";

const sidebarItems = [
	{ icon: homeIcon, label: "Inicio", path: "/newhome" },
	{ icon: moduleIcon, label: "Granjas", path: "/farm" },
	{ icon: userIcon, label: "Usuarios", path: "/users" },
	{ icon: fishIcon, label: "Módulos", path: "/module" },
	{ icon: reporteIcon, label: "Reporte", path: "/report" },
];

// Styled component for section titles
const SectionTitle = styled.h2<{ darkMode: boolean }>`
	font-size: 1.25rem;
	font-weight: 600;
	text-align: center;
	margin-bottom: 1rem;
	color: ${(props) => (props.darkMode ? "white" : "#4a4a4a")};
	transition: color 0.3s ease;
`;

// Styled component for the logout button
const LogoutButtonStyledWrapper = styled.div`
	.button {
		cursor: pointer;
		border: none;
		background: #3cacac;
		color: #fff;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		overflow: hidden;
		position: relative;
		display: grid;
		place-content: center;
		transition:
			background 300ms,
			transform 200ms;
		font-weight: 600;
		margin: 0 auto;
	}

	.button__text {
		position: absolute;
		inset: 0;
		animation: text-rotation 8s linear infinite;

		> span {
			position: absolute;
			transform: rotate(calc(19deg * var(--index)));
			inset: 7px;
			font-size: 14px;
			color: #fff;
		}
	}

	.button__circle {
		position: relative;
		width: 40px;
		height: 40px;
		overflow: hidden;
		background: #fff;
		color: #84db7;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.button:hover {
		background: #000;
		transform: scale(1.05);
	}
	@keyframes text-rotation {
		to {
			rotate: 360deg;
		}
	}
`;

// Logout button component
const LogoutButtonStyled = () => {
	return (
		<LogoutButtonStyledWrapper>
			<button className="button">
				<p className="button__text">
					{Array.from("CERRAR SESIÓN").map((char, index) => (
						<span
							key={index}
							style={{ "--index": index } as React.CSSProperties}
						>
							{char}
						</span>
					))}
				</p>
				<div className="button__circle">
					<LogoutButton />
				</div>
			</button>
		</LogoutButtonStyledWrapper>
	);
};

// Main Report component
const Report: FC = () => {
	const [selectedFarm, setSelectedFarm] = useState<number | null>(null);
	const [selectedModule, setSelectedModule] = useState<number | null>(null);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true); // State for loading
	const [isOpen, setIsOpen] = useState(false); // State for sidebar visibility
	const [userName, setUserName] = useState<string>("Usuario"); // State for user name
	const [darkMode, setDarkMode] = useState(false); // State for dark mode
	const menuRef = useRef<HTMLDivElement>(null);
	const [animateSidebar, setAnimateSidebar] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Add isMobile state
	// Labels and data for charts
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
	const weeklyData = [25, 28, 22, 30, 26, 24, 27];
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
	const monthlyData = [22, 24, 26, 28, 30, 32, 34, 33, 31, 29, 27, 25];

	// Check token validity and set user name
	useEffect(() => {
		if (!isTokenValid()) {
			console.log("Redirecting to /auth from Report component");
			void navigate({ to: "/auth" });
		} else {
			const name = localStorage.getItem("userName");
			console.log("User name retrieved from localStorage:", name);
			setUserName(name || "Usuario");
		}
	}, [navigate]);

	// Handle screen resizing for mobile view
	useEffect(() => {
		const handleResize = () => {
			const isMobileView = window.innerWidth < 768;
			setIsMobile(isMobileView);

			if (!isMobileView) {
				setAnimateSidebar(true);
				setTimeout(() => {
					setAnimateSidebar(false);
				}, 500);
			}
		};

		window.addEventListener("resize", handleResize);
		// Call once to set initial state
		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// Retrieve dark mode state from localStorage
	useEffect(() => {
		const savedDarkMode = localStorage.getItem("darkMode") === "true";
		setDarkMode(savedDarkMode);
		document.body.classList.toggle("dark-mode", savedDarkMode);
	}, []);

	// Toggle dark mode
	const toggleDarkMode = (): void => {
		const newDarkMode = !darkMode;
		setDarkMode(newDarkMode);
		localStorage.setItem("darkMode", newDarkMode.toString());
		document.body.classList.toggle("dark-mode", newDarkMode);
	};

	// Simulate loading state
	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 2000);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	// Handle sidebar click outside
	useEffect(() => {
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

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	// Prevent scrolling when sidebar is open
	useEffect(() => {
		document.body.style.overflowY = isOpen ? "hidden" : "auto";

		return () => {
			document.body.style.overflowY = "auto";
		};
	}, [isOpen]);

	// Handle navigation
	const handleNavigation = (path: string): void => {
		void navigate({ to: path });
		setIsOpen(false);
	};

	const [period, ] = useState("daily");
	const [sensorType, ] = useState("Temperature");
	const [startDate, ] = useState("2025-01-01");
	const [endDate, ] = useState("2025-04-27");

	// Define types for report data
	type ChartData = {
		labels: Array<string>;
		datasets: Array<{ data: Array<number> }>;
	};

	type ReportDataItem = {
		chartData: ChartData;
	};

	type ReportDataResponse = {
		data: Array<ReportDataItem>;
	};

	const {
		data: reportData,
	} = useReport({
		moduleId: selectedModule ?? 0,
		startDate,
		endDate,
		period,
		sensorType,
		enabled: !!selectedModule,
	}) as {
		data?: ReportDataResponse;
		loading: boolean;
		error: unknown;
	};

	return (
		<div
			className={`flex h-screen font-sans ${
				darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
			}`}
		>
			{/* Sidebar toggle button */}
			<button
				id="menu-button"
				className={`absolute top-4 left-4 z-50 p-2 rounded shadow-md md:hidden transition-colors ${
					darkMode
						? "bg-gray-800 text-gray-200 hover:bg-gray-700"
						: "bg-[#d3d3d3] text-gray-700 hover:bg-gray-300"
				}`}
				onClick={() => {
					setIsOpen(!isOpen);
				}}
			>
				{isOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			{/* Sidebar */}
			<SideBar
				LogoutButtonStyled={<LogoutButtonStyled />}
				acuaterraLogo={acuaterraLogo}
				animateSidebar={animateSidebar}
				darkMode={darkMode}
				handleNavigation={handleNavigation}
				isMobile={isMobile}
				isOpen={isOpen}
				items={sidebarItems}
				location={{ pathname: location.pathname }}
				menuRef={menuRef}
				setIsOpen={setIsOpen}
				toggleDarkMode={toggleDarkMode}
				userName={userName}
			/>

			{/* Main content */}
			<main
				className={`flex-1 p-6 overflow-y-auto ${isOpen ? "" : "md:ml-64"}`}
			>
				{loading ? (
					<LoaderAcua darkMode={darkMode} />
				) : (
					<>
						<h1
							className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-5 text-center ${
								darkMode ? "text-white" : "text-black"
							}`}
						>
							Reportes
						</h1>
						<p className="mb-6 text-center">
							Visualización y generación de reportes.
						</p>

						<FarmModuleSelector
							darkMode={darkMode}
							selectedFarm={selectedFarm}
							selectedModule={selectedModule}
							setSelectedFarm={setSelectedFarm}
							setSelectedModule={setSelectedModule}
						/>

						{/* Real-time behavior chart */}
						<div className="mt-8">
							<SectionTitle darkMode={darkMode}>
								Comportamiento en Tiempo Real
							</SectionTitle>
							<SensorChart
								color="rgba(75, 192, 192, 1)"
								data={sensorData}
								labels={sensorLabels}
							/>
						</div>

						{/* Weekly behavior chart */}
						<div className="mt-8">
							<SectionTitle darkMode={darkMode}>
								Comportamiento Semanal
							</SectionTitle>
							<SensorChart
								color="rgba(255, 99, 132, 1)"
								data={weeklyData}
								labels={weeklyLabels}
							/>
						</div>

						{/* Monthly behavior chart */}
						<div className="mt-8">
							<SectionTitle darkMode={darkMode}>
								Comportamiento Mensual
							</SectionTitle>
							<SensorChart
								color="rgba(54, 162, 235, 1)"
								data={monthlyData}
								labels={monthlyLabels}
							/>
						</div>

						{/* Report data display */}
						<div className="mt-8">
							<SectionTitle darkMode={darkMode}>Reporte de Datos servicio</SectionTitle>
							<SensorChart
								color="rgba(75, 192, 192, 1)"
								data={
									reportData?.data?.[0]?.chartData?.datasets?.[0]?.data ??
									sensorData
								}
								labels={
									reportData?.data?.[0]?.chartData?.labels ?? sensorLabels
								}
							/>
						</div>
					</>
				)}
			</main>
		</div>
	);
};

export default Report;
