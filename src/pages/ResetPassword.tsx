import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { resetPassword } from "../services/authService";

export const ResetPassword = (): JSX.Element => {
  const { token }: { token : string} = useSearch({ from: "/reset-password" }); // Obtiene el token desde los parámetros de búsqueda
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (_: React.FormEvent): Promise<void> => {
    _.preventDefault();
    setError(null);

    if (!token) {
      setError("Token inválido o no proporcionado.");
      return;
    }
    console.log("Aja",token);

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, newPassword, confirmPassword });
      setSuccess(true);
    } catch (error_) {
        console.error(error_);
      setError("Error al cambiar la contraseña. Inténtalo de nuevo.");
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
          ¡Contraseña cambiada exitosamente!
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
        <h1 className="text-2xl font-bold mb-4">Cambiar Contraseña</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Nueva Contraseña</label>
          <input
            required
            className="w-full p-2 border border-gray-300 rounded"
            type="password"
            value={newPassword}
            onChange={(_) => { setNewPassword(_.target.value); }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Confirmar Contraseña</label>
          <input
            required
            className="w-full p-2 border border-gray-300 rounded"
            type="password"
            value={confirmPassword}
            onChange={(_) => { setConfirmPassword(_.target.value); }}
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          disabled={loading}
          type="submit"
        >
          {loading ? "Cambiando..." : "Cambiar Contraseña"}
        </button>
      </form>
    </motion.div>
  );
};