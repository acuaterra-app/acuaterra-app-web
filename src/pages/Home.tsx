import { useState, type FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import acuaterraLogo from "../assets/images/logo.png";
import phoneHome from "../assets/images/phone.jpg";
import LoaderAcua from "../components/loaders/LoaderAcua"; // Importamos el Loader

const Welcome: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = (): void => {
    setLoading(true); // Activamos el loader antes de navegar
    setTimeout(() => {
      void navigate({ to: "/auth" });
    }, 1500); // Esperamos 1.5s para mostrar el efecto del loader
  };

  if (loading) {
    return <LoaderAcua />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white font-sans p-8">
      <div className="md:w-1/2 flex flex-col items-center justify-center text-center space-y-6">
        <img alt="Acuaterra Logo" className="h-[250px] mb-4" src={acuaterraLogo} />

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          ¡Bienvenidos a Acuaterra!
        </h1>

        <button
          className="
            bg-[#44cbd3] hover:bg-[#3cacac]
            text-white font-semibold px-6 py-3 
            rounded-lg transition
            focus:outline-none focus:ring-2 focus:ring-[#44cbd3]
          "
          onClick={handleStart}
        >   
          ¡Comenzar!
        </button>

        <div className="mt-8">
          <p className="text-xs text-gray-500">
            versión 1.0 - Advanced Aquaponics Monitoring System <br />
            AGUA TERRA © 2023
          </p>
        </div>
      </div>

      <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
        <img
          alt="Vista de la app en teléfono"
          className="max-h-[800px] object-contain"
          src={phoneHome}
        />
      </div>
    </div>
  );
};

export default Welcome;
