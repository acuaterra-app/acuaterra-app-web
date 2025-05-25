import type React from "react";
import { Menu, X } from "lucide-react";

interface HamburgerMenuButtonProps {
  isOpen: boolean;
  darkMode: boolean;
  onClick: () => void;
}

const HamburgerMenuButton: React.FC<HamburgerMenuButtonProps> = ({
  isOpen,
  darkMode,
  onClick,
}) => (
  <button
    id="menu-button"
    style={{ pointerEvents: "auto" }}
    className={`absolute top-4 left-4 z-50 p-2 rounded shadow-md md:hidden opacity-30 hover:opacity-100 transition-opacity ${
      darkMode
        ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
        : "bg-[#d3d3d3] text-gray-700 hover:bg-gray-300"
    }`}
    onClick={onClick}
  >
    {isOpen ? <X size={24} /> : <Menu size={24} />}
  </button>
);

export default HamburgerMenuButton;