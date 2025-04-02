import { useState, type FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion"; // Importamos Framer Motion
import acuaterraLogo from "../assets/images/logo.png";
import phoneHome from "../assets/images/phone.jpg";
import LoaderAcua from "../components/loaders/LoaderAcua";

const Welcome: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = (): void => {
    setLoading(true);
    setTimeout(() => {
      void navigate({ to: "/auth" });
    }, 1500);
  };

  if (loading) {
    return <LoaderAcua />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white font-sans p-8">
      {/* Main Content*/}
      {/* Main Content */}
<motion.div
  animate={{ opacity: 1, x: 0 }} // Animación: aparece y se posiciona
  className="w-full md:w-1/2 flex flex-col items-center justify-center text-center space-y-6"
  initial={{ opacity: 0, x: -100 }} // Estado inicial: invisible y desplazado hacia la izquierda
  transition={{ duration: 0.8 }} // Duración de la animación
>
  <motion.img
    alt="Acuaterra Logo"
    animate={{ opacity: 1, y: 0 }}
    className="h-24 md:h-[250px] mb-4"
    initial={{ opacity: 0, y: -50 }}
    src={acuaterraLogo}
    transition={{ type: "spring", stiffness: 100, damping: 10 }}
    whileHover={{ rotate: 10, scale: 1.1 }}
  />

  <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
    ¡Bienvenidos a Acuaterra!
  </h1>

  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="
      bg-[#44cbd3] hover:bg-[#3cacac]
      text-white font-semibold px-6 py-3
      rounded-lg transition
      focus:outline-none focus:ring-2 focus:ring-[#44cbd3]
    "
    onClick={handleStart}
  >
    ¡Comenzar!
  </motion.button>

  <div className="mt-8">
    <p className="text-xs text-gray-500">
      versión 1.0 - Advanced Aquaponics Monitoring System <br />
      AGUA TERRA © 2023
    </p>
  </div>
</motion.div>

{/* Animación del mockup */}
<motion.div
  animate={{ opacity: 1, x: 0 }} // Animación: aparece y se posiciona
  className="hidden md:flex md:w-1/2 justify-center"
  initial={{ opacity: 0, x: 100 }} // Estado inicial: invisible y desplazado hacia la derecha
  transition={{ duration: 0.8 }} // Duración de la animación
>
  <motion.img
    alt="Vista de la app en teléfono"
    className="max-h-[800px] object-contain"
    src={phoneHome}
    whileHover={{ scale: 1.05 }} // Escala al pasar el cursor
  />
</motion.div>
    </div>
  );
};

export default Welcome;
