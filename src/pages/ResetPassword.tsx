import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { resetPassword } from "../services/authService";
import logo from "../assets/images/logo.png"; // Asegúrate de que el logo esté en esta ruta
import showPass from "../assets/images/showIconW.png"; // Imagen para mostrar contraseña
import hidePass from "../assets/images/hideIconW.png"; // Imagen para ocultar contraseña

export const ResetPassword = (): JSX.Element => {
  const { token }: { token: string } = useSearch({ from: "/reset-password" }); // Obtiene el token desde los parámetros de búsqueda
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d).+$/; // Al menos una mayúscula, un carácter especial y un número
    return passwordRegex.test(password);
  };

  const handleSubmit = async (_: React.FormEvent): Promise<void> => {
    _.preventDefault();
    setError(null);

    if (!token) {
      setError("Token inválido o no proporcionado.");
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Este campo no debe ir vacío.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "La contraseña debe contener al menos una letra mayúscula, un carácter especial y un número."
      );
      return;
    }

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
        className="bg-white p-6 rounded shadow-lg w-full max-w-md transition-shadow hover:shadow-2xl"
        onSubmit={handleSubmit}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <motion.img
            alt="Logo"
            className="h-20 w-auto"
            src={logo}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }} // Animación de escala al pasar el mouse
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold mb-5 text-center text-gray-700">
          Cambiar Contraseña
        </h1>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* New Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Nueva Contraseña</label>
          <div className="flex items-center border border-gray-300 rounded">
            <input
              required
              className="w-full p-2 rounded-l"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(_) => {
                setNewPassword(_.target.value);
              }}
            />
            <button
              className="p-2"
              type="button"
              onClick={() => { setShowNewPassword(!showNewPassword); }}
            >
              <img
                alt={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="h-5 w-5"
                
                src={showNewPassword ? hidePass : showPass}
              />
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Confirmar Contraseña</label>
          <div className="flex items-center border border-gray-300 rounded">
            <input
              required
              className="w-full p-2 rounded-l"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(_) => {
                setConfirmPassword(_.target.value);
              }}
            />
            <button
              className="p-2"
              type="button"
              onClick={() => { setShowConfirmPassword(!showConfirmPassword); }}
            >
              <img
                alt={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="h-5 w-5"
                src={showConfirmPassword ? hidePass : showPass}
              />
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          className="w-full py-2 px-4 rounded hover:brightness-110 transition bg-primary text-white"
          disabled={loading}
          type="submit"
        >
          {loading ? "Cambiando..." : "Cambiar Contraseña"}
        </button>
      </form>
    </motion.div>
  );
};