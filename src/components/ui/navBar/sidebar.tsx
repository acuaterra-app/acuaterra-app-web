import type { FunctionComponent } from "react";
import { Link } from "@tanstack/react-router";

const Sidebar: FunctionComponent = () => {
	return (
		<div className="bg-gray-800 text-white w-64 h-screen flex flex-col">
			<div className="p-4 text-2xl font-bold">My App</div>
			<nav className="flex flex-col p-4">
				<Link className="p-2 hover:bg-gray-700 rounded" to="/">
					Home
				</Link>
				<Link className="p-2 hover:bg-gray-700 rounded" to="/users">
					Users
				</Link>
				<Link className="p-2 hover:bg-gray-700 rounded" to="/module">
					Module
				</Link>
				<Link className="p-2 hover:bg-gray-700 rounded" to="/bitacoras">
					Bitacoras
				</Link>
				<Link className="p-2 hover:bg-gray-700 rounded" to="/farm">
					Farm
				</Link>
				{/* if we need more, we can add then */}
			</nav>
		</div>
	);
};

export default Sidebar;
