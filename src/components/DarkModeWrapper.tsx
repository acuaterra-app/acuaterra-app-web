import type { FC } from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

interface DarkModeWrapperProps {
  children: (darkMode: boolean) => React.ReactNode;
}

const DarkModeWrapper: FC<DarkModeWrapperProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Recuperar el estado del "Modo Oscuro" desde localStorage al cargar la página
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.body.classList.toggle("dark-mode", savedDarkMode);
  }, []);

  // Alternar el "Modo Oscuro" y guardar el estado en localStorage
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
      {/* Botón para alternar entre modos */}
      <button
        className="absolute top-4 right-4 z-50 bg-gray-300 p-2 rounded shadow-md flex items-center justify-center"
        onClick={toggleDarkMode}
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Renderizar contenido hijo con el estado darkMode */}
      {children(darkMode)}
    </div>
  );
};

export default DarkModeWrapper;