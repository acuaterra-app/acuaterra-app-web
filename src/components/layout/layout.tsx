import type { FunctionComponent } from "react";
//import Navbar from "../ui/navBar/navbar";

// eslint-disable-next-line no-duplicate-imports
import type { ReactNode } from "react";
//import Sidebar from "../ui/navBar/sidebar";

interface LayoutProps {
	children: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
	return (
		<div className="flex">
			 {/* <Sidebar /> */}
			<div className="flex-1">
				 {/* <Navbar /> */}
				<main className="p-4">{children}</main>
			</div>
		</div>
	);
};

export default Layout;
