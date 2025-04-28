import { useState } from "react";
import { motion } from "framer-motion";
import { requestPasswordReset } from "../services/authService";
import { useNavigate } from "@tanstack/react-router";
import logo from "../assets/images/logo.png"; // Asegúrate de que el logo esté en esta ruta

export const RequestPasswordReset = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Debe contener "@" y ".com"
    return emailRegex.test(email);
  };

  const handleSubmit = async (_: React.FormEvent): Promise<void> => {
    _.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Este campo no puede ir vacío.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset({ email });
      setSuccess(true);
    } catch (error_) {
      console.error(error_);
      setError(
        "Error al solicitar el restablecimiento de contraseña. Inténtalo de nuevo."
      );
    } finally {
      await navigate({ to: "/auth", replace: true }).catch((error_) => {
        console.error("Error al navegar:", error_);
        setLoading(false);
      });
    }
  };

  if (success) {
    return (
      <motion.div
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 px-4"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-green-600 text-lg font-bold text-center">
          ¡Correo enviado! Revisa tu bandeja de entrada para continuar con el
          restablecimiento de tu contraseña.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 px-4"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form
        className="bg-white p-6 rounded shadow-lg w-full max-w-md transition-shadow hover:shadow-2xl"
        onSubmit={handleSubmit}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <motion.img
            alt="Logo"
            className="h-16 w-auto sm:h-20"
            src={logo}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }} // Animación de escala al pasar el mouse
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold mb-5 text-center text-gray-700">
          Recuperar Contraseña
        </h1>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Correo Electrónico</label>
          <input
            required
            className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
            type="email"
            value={email}
            onChange={(_) => {
              setEmail(_.target.value);
            }}
          />
          <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center">
            Recuerda ingresar una dirección de email válida.
          </p>
        </div>

        {/* Submit Button */}
        <button
          className="w-full py-2 px-4 rounded hover:brightness-110 transition bg-primary text-white text-sm sm:text-base"
          disabled={loading}
          type="submit"
        >
          {loading ? "Enviando..." : "Enviar Enlace"}
        </button>
      </form>
    </motion.div>
  );
};