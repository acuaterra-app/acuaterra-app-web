import type { FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import acuaterraLogo from "../assets/images/logo.png";

const NotFound: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-lightGray to-teal text-darkGray">
      {/* Logo */}
      <div className="mb-8">
        <img
          alt="Acuaterra Logo"
          className="h-32 md:h-48 lg:h-56 transition-transform duration-300 hover:scale-110"
          src={acuaterraLogo}
        />
      </div>

      {/* Error Message */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold black mb-4 text-center">
        404
      </h1>
      <p className="text-lg md:text-xl lg:text-2xl text-darkGray text-center mb-8">
        Lo sentimos, la página que buscas no existe.
      </p>

      {/* Button to redirect to Auth */}
      <button
        className="px-8 py-4 bg-secondary text-white font-bold text-lg rounded-xl border-4 border-tertiary shadow-[5px_5px_0px_0px_rgba(52,150,158,1)] transition-transform duration-200 hover:translate-x-1 hover:-translate-y-1"
        onClick={() => navigate({ to: "/auth" })}
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default NotFound;