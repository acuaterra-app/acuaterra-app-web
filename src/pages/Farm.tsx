import InputCustomComponent from "../components/ui/input/input";
import acuaterraLogo from "../assets/images/logo.png";
import ButtonComponent from "../components/ui/button/button";
import type { FunctionComponent } from "react";
import { useAuth } from "../hooks/useAuth";

export const Farm: FunctionComponent = () => {
  const { email, setEmail, password, setPassword, error, loading, handleLogin } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <div className="mb-6 flex flex-col items-center">
        <img alt="Acuaterra Logo" className="h-32 md:h-48 lg:h-64 mb-2" src={acuaterraLogo} />
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-9">Login</h1>

      <div className="w-full max-w-xs md:max-w-sm lg:max-w-md space-y-6 md:space-y-8 lg:space-y-10">
        <div className="flex flex-col items-center">
          <InputCustomComponent
            name="email"
            placeholder="Ingrese Correo Electrónico"
            type="email"
            value={email}
            onChange={(event) => { setEmail(event.target.value); }}
          />
          {error && <p className="text-custom-error mt-2">{error}</p>}
        </div>

        <div className="flex flex-col items-center">
          <InputCustomComponent
            name="password"
            placeholder="Ingrese Contraseña"
            type="password"
            value={password}
            onChange={(event) => { setPassword(event.target.value); }}
          />
          {error && <p className="text-custom-error mt-2">{error}</p>}
        </div>

        <div className="flex flex-col items-center">
          <ButtonComponent
            className="bg-[#44cbd3] hover:bg-[#3cacac] text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-[#44cbd3] focus:ring-offset-2"
            disabled={loading}
            type="button"
            onClick={handleLogin}
          >
            {loading ? "Cargando..." : "¡Comenzar!"}
          </ButtonComponent>
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-20">versión 1.0 - Advanced Aquaponics Monitoring System</p>
    </div>
  );
};

export default Farm;