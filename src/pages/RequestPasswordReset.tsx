import { useState } from "react";
import { motion } from "framer-motion";
import { requestPasswordReset } from "../services/authService";
import { useNavigate } from "@tanstack/react-router";

export const RequestPasswordReset = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (_: React.FormEvent): Promise<void> => {
    _.preventDefault();
    setError(null);

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
      setError("Error al solicitar el restablecimiento de contraseña. Inténtalo de nuevo.");
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
        className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-green-600 text-lg font-bold">
          ¡Correo enviado! Revisa tu bandeja de entrada para continuar con el restablecimiento de tu contraseña.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-4">Recuperar Contraseña</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Correo Electrónico</label>
          <input
            required
            className="w-full p-2 border border-gray-300 rounded"
            type="email"
            value={email}
            onChange={(_) => { setEmail(_.target.value); }}
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          disabled={loading}
          type="submit"
        >
          {loading ? "Enviando..." : "Enviar Enlace"}
        </button>
      </form>
    </motion.div>
  );
};