import InputCustomComponent from "../components/ui/input/input";
import acuaterraLogo from "../assets/images/logo.png";
import ButtonComponent from "../components/ui/button/button";
import type { FunctionComponent } from "react";
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
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4 md:p-8 lg:p-12">
      <div className="mb-6 flex flex-col items-center">
        <img
          alt="Acuaterra Logo"
          className="h-32 md:h-48 lg:h-64 mb-2"
          src={acuaterraLogo}
        />
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-9">Login</h1>

      <form
        className="w-full max-w-xs md:max-w-sm lg:max-w-md space-y-6 md:space-y-8 lg:space-y-10"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center">
          <InputCustomComponent
            error={error && !email ? "El campo email es requerido" : ""}
            name="email"
            placeholder="Ingrese Correo Electrónico"
            type="email"
            value={email}
            onChange={(event) => { setEmail(event.target.value); }}
          />
        </div>

        <div className="flex flex-col items-center">
          <InputCustomComponent
            error={error && !password ? "El campo contraseña es requerido" : ""}
            name="password"
            placeholder="Ingrese Contraseña"
            type="password"
            value={password}
            onChange={(event) => { setPassword(event.target.value); }}
          />
        </div>

        <div className="flex flex-col items-center">
          <ButtonComponent
            className="bg-[#44cbd3] hover:bg-[#3cacac] text-white px-4 py-2 md:px-6 md:py-3 rounded transition focus:outline-none focus:ring-2 focus:ring-[#44cbd3] focus:ring-offset-2"
            disabled={loading}
            type="submit"
          >
            {loading ? "Cargando..." : "¡Comenzar!"}
          </ButtonComponent>
        </div>
      </form>

      {error && email && password && (
        <p className="mt-4 text-darkGray font-semibold">
          Credenciales Incorrectas
        </p>
      )}

      <p className="text-gray-500 text-sm mt-20">
        versión 1.0 - Advanced Aquaponics Monitoring System
      </p>
    </div>
  );
};

export default Auth;
