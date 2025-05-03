import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { resetPassword } from "../services/authService";
import logo from "../assets/images/logo.png"; 
import showPass from "../assets/images/showIconW.png"; 
import hidePass from "../assets/images/hideIconW.png"; 

export const ResetPassword = (): JSX.Element => {
  const { token }: { token: string } = useSearch({ from: "/reset-password" }); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d).+$/; // At least one uppercase letter, one special character, and one number
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
        className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 px-4"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-green-600 text-lg font-bold text-center">
          ¡Contraseña cambiada exitosamente!
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
            whileHover={{ scale: 1.1 }} 
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 text-center text-gray-700">
          Cambiar Contraseña
        </h1>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* New Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Nueva Contraseña</label>
          <div className="flex items-center border border-gray-300 rounded">
            <input
              required
              className="w-full p-2 rounded-l text-sm sm:text-base"
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
          <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center">
            Recuerda la contraseña debe contener al menos una mayúscula, un número y un carácter especial.
          </p>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Confirmar Contraseña</label>
          <div className="flex items-center border border-gray-300 rounded">
            <input
              required
              className="w-full p-2 rounded-l text-sm sm:text-base"
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
          className="w-full py-2 px-4 rounded hover:brightness-110 transition bg-primary text-white text-sm sm:text-base"
          disabled={loading}
          type="submit"
        >
          {loading ? "Cambiando..." : "Cambiar Contraseña"}
        </button>
      </form>
    </motion.div>
  );
};