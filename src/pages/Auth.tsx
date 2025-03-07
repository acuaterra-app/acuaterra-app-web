/**
 * Página de Login - Acuaterra (Auth).
 * Visual: Formulario basado en el Figma.
 */

import type { FunctionComponent } from "react";
import ButtonComponent from "../components/ui/button/button";
import InputCustomComponent from "../components/ui/input/input";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
// eslint-disable-next-line no-duplicate-imports
import { useState } from "react";
import acuaterraLogo from "../assets/images/logo.png";


const API_BASE_URL: string = import.meta.env["VITE_API_BASE_URL"] as string;

export const Auth: FunctionComponent = () => {
  const navigate = useNavigate();
  const { email, setEmail, password, setPassword, loading } = useAuth();
  const [localEmailError, setLocalEmailError] = useState("");
  const [localPasswordError, setLocalPasswordError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  
  const handleLocalLogin = async (): Promise<void> => {
        let hasError = false;
           if (!email) {
              setLocalEmailError("¡Campo correo electrónico es requerido!");
              hasError = true;
          }else{
               setLocalEmailError("");
             }

           if (!password) {
               setLocalPasswordError("¡Campo contraseña es requerido!");
               hasError = true;

          } else if (password.length < 6) {
                setLocalPasswordError("¡La contraseña debe tener al menos 6 caracteres!");
                hasError = true;   

          }
           else {
               setLocalPasswordError("");
             }

          if (hasError) {
              return;
             }


    setLocalLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = (await response.json()) as { token: string };
                    localStorage.setItem("token", data.token);
                    await navigate({ to: "/newHome" });
                    } catch (error) {
      setLocalPasswordError("Invalid email or password");
      console.error(error);
                    } finally {
      setLocalLoading(false);
         }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      
         <div className="mb-6 flex flex-col items-center">
              <img alt="Acuaterra Logo" className="h-32 md:h-48 lg:h-64 mb-2" src={acuaterraLogo} />
         </div>

         <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-9">Login</h1>

        <div className="w-full max-w-xs md:max-w-sm lg:max-w-md space-y-6 md:space-y-8 lg:space-y-10">
           <div  className="flex flex-col items-center">
             <InputCustomComponent
                  name="email"
                  placeholder="Ingrese Correo Electrónico"
                  type="email"
                  value={email}
                  onChange={(event) => { setEmail(event.target.value); setLocalEmailError(""); }}
                  //showError={false} 
                  />
                  {localEmailError && <p className="text-custom-error mt-2">{localEmailError}</p>}
           </div>


           <div  className="flex flex-col items-center">
             <InputCustomComponent
                 name="password"
                 placeholder="Ingrese Contraseña"
                 type="password"
                 value={password}
                 onChange={(event) => { setPassword(event.target.value); setLocalPasswordError(""); }}
                 //showError={false} 
                 />
                 {localPasswordError && <p className="text-custom-error mt-2">{localPasswordError}</p>}
            </div>

        
           <div  className="flex flex-col items-center">
             <ButtonComponent
                 className="bg-[#44cbd3] hover:bg-[#3cacac] text-white px-4 py-2   rounded transition focus:outline-none focus:ring-2 focus:ring-[#44cbd3] focus:ring-offset-2  "
                 disabled={localLoading || loading}
                 type="button"
                 onClick={handleLocalLogin}
                 >
                {localLoading || loading ? "Cargando..." : "¡Comenzar!"}
             </ButtonComponent>
        </div>
    </div>

      <p className="text-gray-500 text-sm mt-20">versión 1.0 - Advanced Aquaponics Monitoring System</p>
    
    </div>
  );
};

export default Auth;