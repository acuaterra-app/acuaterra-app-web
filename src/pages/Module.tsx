import type { FunctionComponent } from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import Layout from "../components/layout/layout";
import LoaderAcua from "../components/loaders/LoaderAcua";
import TableWithActions from "../components/ui/table/tableWithActions";
import TableWithActionsMobile from "../components/ui/table/TableWithActionsMobile";
import useModulesByFarm from "../hooks/useModulesByFarm";
import useFarms from "../hooks/useFarms";
import { isTokenValid } from "../common/isTokenValid";
import { Menu, X } from "lucide-react";
import acuaterraLogo from "../assets/images/logo.png";
import homeIcon from "../assets/images/home.png";
import moduleIcon from "../assets/images/module.png";
import userIcon from "../assets/images/userlogo.png";
import reportIcon from "../assets/images/reporte.png";
import fishIcon from "../assets/images/pez.png";
import LogoutButton from "../components/ui/button/logoutButton";
import styled from "styled-components";

const SidebarLogoWrapper = styled.div`
  .logo {
    width: 80px;
    height: 80px;
    transition: transform 0.3s ease;
  }

  .logo:hover {
    transform: scale(1.1);
  }
`;

const WelcomeText = styled.p`
  font-size: 1.3rem;
  font-weight: bold;
  color: #4a4a4a;
  margin-top: 10px;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const LogoutButtonStyledWrapper = styled.div`
  .button {
    cursor: pointer;
    border: none;
    background: #3cacac;
    color: #fff;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    display: grid;
    place-content: center;
    transition: background 300ms, transform 200ms;
    font-weight: 600;
    margin: 0 auto;
  }

  .button__text {
    position: absolute;
    inset: 0;
    animation: text-rotation 8s linear infinite;

    > span {
      position: absolute;
      transform: rotate(calc(19deg * var(--index)));
      inset: 7px;
      font-size: 14px;
      color: #fff;
    }
  }

  .button__circle {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
    background: #fff;
    color: #84db7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button:hover {
    background: #000;
    transform: scale(1.05);
  }

  @keyframes text-rotation {
    to {
      rotate: 360deg;
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const LogoutButtonStyled = () => {
  return (
    <LogoutButtonStyledWrapper>
      <button className="button">
        <p className="button__text">
          {Array.from("CERRAR SESIÓN").map((char, index) => (
            <span key={index} style={{ "--index": index } as React.CSSProperties}>
              {char}
            </span>
          ))}
        </p>
        <div className="button__circle">
          <LogoutButton />
        </div>
      </button>
    </LogoutButtonStyledWrapper>
  );
};

export const Module: FunctionComponent = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [animateSidebar, setAnimateSidebar] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("Usuario"); // Estado para el nombre del usuario

  const { modules, loading, error, total, page, perPage, setPage } =
    useModulesByFarm(selectedFarmId || 0);
  const { farms, loading: farmsLoading, error: farmsError } = useFarms();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTokenValid()) {
      console.log("Redirigiendo a /auth desde el componente Modules");
      void navigate({ to: "/auth" });
    } else {
      // Obtener el nombre del usuario desde localStorage
      const name = localStorage.getItem("userName");
      console.log("Nombre del usuario obtenido desde localStorage:", name);
      setUserName(name || "Usuario"); // Si no hay nombre, usar "Usuario" como predeterminado
    }
  }, [navigate]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      if (!isMobileView) {
        setAnimateSidebar(true);
        setTimeout(() => {
          setAnimateSidebar(false);
        }, 500);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const menuButton = document.getElementById("menu-button");
      if (
        isOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflowY = isOpen ? "hidden" : "auto";
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [isOpen]);

  const handleNavigation = (path: string): void => {
    void navigate({ to: path });
    setIsOpen(false);
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-white font-sans relative">
        {/*Side bar's open and close button*/}
        <button
          className="fixed top-4 left-4 z-50 bg-gray-300 p-2 rounded shadow-md md:hidden"
          id="menu-button"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/*Side Bar */}
        <aside
          ref={menuRef}
          id="sidebar"
          className={`fixed top-0 left-0 w-64 h-screen bg-[#e0e0e0] border-r border-gray-400 flex flex-col transform transition-transform duration-300 ease-in-out z-50 ${
            isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
          } ${animateSidebar ? "animate-slide-in" : ""}`}
          style={{
            height: "100vh",
            boxShadow: "7px 0 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="p-4 flex flex-col items-center relative">
            <button
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200 lg:hidden"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <X size={24} />
            </button>

            <SidebarLogoWrapper>
              <img alt="Acuaterra Logo" className="logo mb-2" src={acuaterraLogo} />
            </SidebarLogoWrapper>
            <WelcomeText>Bienvenido, {userName}!</WelcomeText>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-3 md:space-y-20 mt-4 md:mt-20">
              {[
                { icon: homeIcon, label: "Inicio", path: "/newhome" },
                { icon: moduleIcon, label: "Granjas", path: "/farm" },
                { icon: userIcon, label: "Usuarios", path: "/users" },
                { icon: fishIcon, label: "Módulos", path: "/module" },
                { icon: reportIcon, label: "Reporte", path: "/report" },
              ].map((item, index) => (
                <li
                  key={index}
                  className={`relative group flex items-center justify-center gap-3 p-2 cursor-pointer overflow-hidden rounded-lg ${
                    location.pathname === item.path
                      ? "bg-[#3cacac] text-white shadow-md"
                      : "text-gray-600 group-hover:text-white"
                  }`}
                  onClick={() => {
                    handleNavigation(item.path);
                  }}
                >
                  <span
                    className={`absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-lg ${
                      location.pathname === item.path ? "bg-[#3cacac]" : "bg-[#3cacac]"
                    }`}
                  ></span>
                  <span className="relative z-10 flex items-center gap-3 font-bold">
                    <img alt={item.label} className="h-6 w-6" src={item.icon} />
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 md:mt-20">
              <LogoutButtonStyled />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:ml-64 max-w-full overflow-x-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 text-center text-gray-700">
            Lista de Módulos
          </h1>

          {/* Selector de granjas */}
          <div className="mb-6 max-w-md mx-auto">
            <label className="block text-center text-2xl font-bold mb-4">
              Seleccione una Granja
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              disabled={farmsLoading}
              onChange={(event) => {
                setSelectedFarmId(Number(event.target.value));
              }}
            >
              <option value="">Seleccione una granja</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
            {farmsError && (
              <p className="text-red-500 mt-2 text-center">
                Error al cargar las granjas
              </p>
            )}
          </div>

          {loading ? (
            <LoaderAcua />
          ) : (
            <>
              {error && <p className="mt-4 text-red-500">Error: {error}</p>}
              <div className="hidden md:block border border-gray-300 rounded-lg p-4 shadow-md w-full max-w-7xl mx-auto animate-square-in-hesitate ">
                <TableWithActions
                  data={modules}
                  error={error}
                  isVisibleActions={false}
                  isVisibleButton={false}
                  limit={perPage}
                  loading={loading}
                  page={page}
                  setLimit={() => {}}
                  setPage={setPage}
                  total={total}
                  columns={[
                    { header: "ID", accessor: "id" },
                    { header: "Nombre", accessor: "name" },
                    { header: "Ubicación", accessor: "location" },
                    {
                      header: "Especie de Pescados",
                      accessor: "species_fish",
                    },
                    { header: "Cantidad", accessor: "fish_quantity" },
                    { header: "Dimensiones", accessor: "dimensions" },
                    {
                      header: "Creado Por",
                      accessor: "creator",
                      render: (module) => module.creator.name.toString(),
                    },
                    {
                      header: "Granja",
                      accessor: "farm",
                      render: (module) => module.farm.name.toString(),
                    },
                  ]}
                  onAdd={() => {
                    console.log("Add new module");
                  }}
                  onDelete={() => {
                    console.log("Delete module");
                  }}
                  onEdit={() => {
                    console.log("Edit module");
                  }}
                />
              </div>

              <div className="block md:hidden border border-gray-300 rounded-lg p-4 shadow-md w-full max-w-sm mx-auto">
                <TableWithActionsMobile
                  data={modules}
                  error={error}
                  isVisibleActions={false}
                  isVisibleButton={false}
                  limit={perPage}
                  loading={loading}
                  page={page}
                  setLimit={() => {}}
                  setPage={setPage}
                  total={total}
                  columns={[
                    { header: "ID", accessor: "id" },
                    { header: "Nombre", accessor: "name" },
                    { header: "Ubicación", accessor: "location" },
                    {
                      header: "Especie de Pescados",
                      accessor: "species_fish",
                    },
                    { header: "Cantidad", accessor: "fish_quantity" },
                    { header: "Dimensiones", accessor: "dimensions" },
                    {
                      header: "Creado Por",
                      accessor: "creator",
                      render: (module) => module.creator.name.toString(),
                    },
                    {
                      header: "Granja",
                      accessor: "farm",
                      render: (module) => module.farm.name.toString(),
                    },
                  ]}
                  onAdd={() => {
                    console.log("Add new module");
                  }}
                  onDelete={() => {
                    console.log("Delete module");
                  }}
                  onEdit={() => {
                    console.log("Edit module");
                  }}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Module;