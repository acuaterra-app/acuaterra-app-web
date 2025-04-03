import InputCustomComponent from "../components/ui/input/input";
import acuaterraLogo from "../assets/images/logo.png";
import type { FunctionComponent } from "react";
import { motion } from "framer-motion"; // Importamos Framer Motion
import { useAuth } from "../hooks/useAuth";
import LoaderAcua from "../components/loaders/LoaderAcua";

export const Auth: FunctionComponent = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  } = useAuth();

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void handleLogin();
  };

  if (loading) {
    return <LoaderAcua />;
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 flex flex-col justify-center items-center p-4 md:p-8 lg:p-12"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col items-center"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          alt="Acuaterra Logo"
          className="h-32 md:h-48 lg:h-64 mb-2"
          src={acuaterraLogo}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          whileHover={{ rotate: 15, scale: 1.2 }}
        />
      </motion.div>

      {/* Título con animación */}
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl lg:text-7xl font-bold mb-9 text-gray-800"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        whileHover={{ scale: 1.1 }}
      >
        Login
      </motion.h1>

      
      <motion.form
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs md:max-w-sm lg:max-w-md space-y-6 md:space-y-8 lg:space-y-10"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        onSubmit={handleSubmit}
      >
        
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center"
          initial={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <InputCustomComponent
            error={error && !email ? "El campo email es requerido" : ""}
            name="email"
            placeholder="Ingrese Correo Electrónico"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </motion.div>

       
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center"
          initial={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <InputCustomComponent
            error={error && !password ? "El campo contraseña es requerido" : ""}
            name="password"
            placeholder="Ingrese Contraseña"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </motion.div>

       
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <button
            className="relative px-8 py-4 bg-[#44cbd3] text-white font-bold text-lg rounded-xl border-4 border-[#3cacac] shadow-[5px_5px_0px_0px_rgba(60,172,172,1)] transition-transform duration-300 hover:translate-x-1 hover:-translate-y-1"
            onClick={handleSubmit}
          >
            ¡Comenzar!
          </button>
        </motion.div>
      </motion.form>

      
      {error && email && password && (
        <motion.p
          animate={{ opacity: 1 }}
          className="mt-4 text-darkGray font-semibold"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Credenciales Incorrectas
        </motion.p>
      )}

      
      <motion.p
        animate={{ opacity: 1 }}
        className="text-gray-500 text-sm mt-20 text-center"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        versión 1.0 - Advanced Aquaponics Monitoring System
      </motion.p>
    </motion.div>
  );
};

export default Auth;