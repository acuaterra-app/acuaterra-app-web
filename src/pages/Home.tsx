import { useState, type FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform } from "framer-motion"; // Importamos Framer Motion
import acuaterraLogo from "../assets/images/logo.png";
import phoneHome from "../assets/images/mockup-phone.png";
import LoaderAcua from "../components/loaders/LoaderAcua";

const Welcome: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleMouseMove = (event: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left - width / 2;
    const y = clientY - top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

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
    <motion.div
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 font-sans p-8"
      initial={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
     
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/2 flex flex-col items-center justify-center text-center space-y-6"
        initial={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.8 }}
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
          animate={{ scale: [1, 1.05, 1] }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="
            bg-[#44cbd3] hover:bg-[#3cacac]
            text-white font-semibold px-6 py-3
            rounded-lg shadow-lg transition
            focus:outline-none focus:ring-4 focus:ring-[#44cbd3]
          "
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
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

      
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex md:w-1/2 justify-center"
        initial={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.8 }}
        onMouseMove={handleMouseMove} 
      >
        <motion.img
          alt="Vista de la app en teléfono"
          className="max-h-[800px] object-contain"
          src={phoneHome}
          whileHover={{ scale: 1.05 }}
          style={{
            rotateX,
            rotateY,
            willChange: "transform",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Welcome;