import InputCustomComponent from "../components/ui/input/input";
import acuaterraLogo from "../assets/images/logo.png";
import type { FunctionComponent } from "react";
import { motion } from "framer-motion"; // Importamos Framer Motion
import { useAuth } from "../hooks/useAuth";
import LoaderAcua from "../components/loaders/LoaderAcua";
// eslint-disable-next-line no-duplicate-imports
import { useState } from "react";

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

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }

    if (!password) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (email && password) {
      void handleLogin();
    }
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
      transition={{ duration: 0.8 }}
    >
      {/* Logo animationn */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col items-center"
        initial={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6 }}
      >
        <motion.img
          alt="Acuaterra Logo"
          className="h-32 md:h-48 lg:h-64 mb-2"
          src={acuaterraLogo}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
          whileHover={{ rotate: 10, scale: 1.1 }}
        />
      </motion.div>

      {/* Títle*/}
      <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-9 text-gray-800">
        Login
      </h1>

      {/* Form Animation */}
      <motion.form
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs md:max-w-sm lg:max-w-md space-y-6 md:space-y-8 lg:space-y-10"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onSubmit={handleSubmit}
      >
        {/* Email Field*/}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center"
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <InputCustomComponent
            error={emailError ? "Completa este campo" : ""}
            name="email"
            placeholder="Ingrese Correo Electrónico"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError(false);
            }}
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">Completa este campo</p>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center"
          initial={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <InputCustomComponent
            error={passwordError ? "Completa este campo" : ""}
            name="password"
            placeholder="Ingrese Contraseña"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setPasswordError(false);
            }}
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">Completa este campo</p>
          )}
        </motion.div>

        {/* Start Buttom */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <button
            className="relative px-8 py-4 bg-[#44cbd3] text-white font-bold text-lg rounded-xl border-4 border-[#3cacac] shadow-[5px_5px_0px_0px_rgba(60,172,172,1)] transition-transform duration-200 hover:translate-x-1 hover:-translate-y-1"
            type="submit"
          >
            ¡Comenzar!
          </button>
        </motion.div>
      </motion.form>

      {/* Genreal Error message */}
      {error && email && password && (
        <motion.p
          animate={{ opacity: 1 }}
          className="mt-4 text-darkGray font-semibold"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Credenciales Incorrectas
        </motion.p>
      )}

      {/* Footer*/}
      <motion.p
        animate={{ opacity: 1 }}
        className="text-gray-500 text-sm mt-20 text-center"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        versión 1.0 - Advanced Aquaponics Monitoring System
      </motion.p>
    </motion.div>
  );
};

export default Auth;