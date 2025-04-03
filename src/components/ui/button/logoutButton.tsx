import type { FunctionComponent } from "react";
import ButtonComponent from "./button";
import { useLogout } from "../../../hooks/useLogout";
import closeSessionIcon from "../../../assets/images/cerrar-sesion.png";

const LogoutButton: FunctionComponent = () => {
  const { loading, handleLogout } = useLogout();

  return (
    <ButtonComponent
      className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
      disabled={loading}
      type="button"
      onClick={handleLogout}
    >
      <img alt="Cerrar Sesión" className="h-6 w-6 mr-2" src={closeSessionIcon} />
      
    </ButtonComponent>
  );
};

export default LogoutButton;

// <span className="font-bold">{loading ? "Cerrando sesión..." : "Cerrar Sesión"}</span> LINE 17