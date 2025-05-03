import type { FC } from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

interface DarkModeWrapperProps {
  children: (darkMode: boolean) => React.ReactNode;
}

const DarkModeWrapper: FC<DarkModeWrapperProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  //  Recover state from localStorage on page load
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.body.classList.toggle("dark-mode", savedDarkMode);
  }, []);

  // rotate between "DarkMode" and save the state in localStorage
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.body.classList.toggle("dark-mode", newDarkMode);
  };

  return (
    <div
      className={`flex min-h-screen font-sans relative overflow-x-auto ${
        darkMode ? "bg-gray-900 text-white" : "bg-[#f5f5f5] text-black"
      }`}
    >
      {/* Darkmode Buttom */}
      <button
        className="absolute top-4 right-4 z-50 bg-gray-300 p-2 rounded shadow-md flex items-center justify-center"
        onClick={toggleDarkMode}
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* render child content with darkmode state */}
      {children(darkMode)}
    </div>
  );
};

export default DarkModeWrapper;