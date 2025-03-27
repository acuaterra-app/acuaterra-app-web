import type { FunctionComponent } from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState, useEffect } from "react";
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

export const Module: FunctionComponent = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);

  const { modules, loading, error, total, page, perPage, setPage } =
    useModulesByFarm(selectedFarmId || 0);
  const { farms, loading: farmsLoading, error: farmsError } = useFarms();

  useEffect(() => {
    if (!isTokenValid()) {
      console.log("Redirigiendo a /auth desde el componente Modules");
      void navigate({ to: "/auth" });
    }
  }, [navigate]);

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

  return (
    <Layout>
      <div className="flex min-h-screen bg-white font-sans relative">
        {/* Sidebar */}
        <button
          className="absolute top-4 left-4 z-50 bg-gray-300 p-2 rounded shadow-md md:hidden"
          id="menu-button"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <aside
          id="sidebar"
          className={`fixed top-0 left-0 w-64 h-screen bg-gray-300 border-r border-gray-400 flex flex-col transform transition-transform duration-300 ease-in-out z-50
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:w-64 md:relative`}
        >
          <div className="p-4 flex flex-col items-center relative">
            <button
              className="absolute top-2 right-2 p-2 text-gray-700 hover:text-gray-900 md:hidden"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <X size={24} />
            </button>
            <img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
            <p className="text-gray-800 font-semibold">Bienvenido, usuario!</p>
          </div>

          <nav className="flex-1">
            <ul className="space-y-3 md:space-y-20 mt-4 md:mt-20">
              <li
                className="flex items-center justify-center gap-3 p-2 cursor-pointer hover:bg-gray-400 rounded-lg"
                onClick={async () => {
                  await navigate({ to: "/newHome" });
                  setIsOpen(false);
                }}
              >
                <img alt="Inicio" className="h-6 w-6" src={homeIcon} />
                <span className="font-bold">Inicio</span>
              </li>
              <li
                className="flex items-center justify-center gap-3 p-2 cursor-pointer hover:bg-gray-400 rounded-lg"
                onClick={async () => {
                  await navigate({ to: "/farm" });
                  setIsOpen(false);
                }}
              >
                <img alt="Granjas" className="h-6 w-6" src={moduleIcon} />
                <span className="font-bold">Granjas</span>
              </li>
              <li
                className="flex items-center justify-center gap-3 p-2 cursor-pointer hover:bg-gray-400 rounded-lg"
                onClick={async () => {
                  await navigate({ to: "/users" });
                  setIsOpen(false);
                }}
              >
                <img alt="Usuarios" className="h-6 w-6" src={userIcon} />
                <span className="font-bold">Usuarios</span>
              </li>
              <li
                className="flex items-center justify-center gap-3 p-2 cursor-pointer bg-gray-400 text-white rounded-lg"
                onClick={async () => {
                  await navigate({ to: "/module" });
                  setIsOpen(false);
                }}
              >
                <img alt="Módulos" className="h-6 w-6" src={fishIcon} />
                <span className="font-bold">Módulos</span>
              </li>
              <li
                className="flex items-center justify-center gap-3 p-2 cursor-pointer hover:bg-gray-400 rounded-lg"
                onClick={async () => {
                  await navigate({ to: "/report" });
                  setIsOpen(false);
                }}
              >
                <img alt="Reporte" className="h-6 w-6" src={reportIcon} />
                <span className="font-bold">Reporte</span>
              </li>
            </ul>
			
            <div className="mt-4 md:mt-20">
						<ul className="space-y-4">
							<li
								className="
                  flex items-center justify-center gap-3 p-2
                  cursor-pointer transition-all duration-300
                  transform origin-center overflow-hidden
                  hover:bg-gray-300 hover:scale-102
                  rounded-lg
                "
							>
								<LogoutButton />
							</li>
						</ul>
					</div>

					<div className="mt-4 md:mt-20">
						<ul className="space-y-4"></ul>
					</div>
				</nav>

				<div className="p-0">
					<p className="text-center text-xs mt-2">
						versión 1.0 <br /> Advanced Aquaponics Monitoring System
					</p>
				</div>
          
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Lista de Módulos</h1>

          {/* Farm Selector */}
          <div className="mb-6 max-w-md mx-auto">
            <label className="block text-center text-2xl font-bold mb-4">
              Seleccione una Granja
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              disabled={farmsLoading}
              onChange={(_) => {
                setSelectedFarmId(Number(_.target.value));
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
              <div className="hidden md:block border border-gray-300 rounded-lg p-4 shadow-md w-full max-w-7xl mx-auto">
                <TableWithActions
                  data={modules}
                  error={error}
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
                  onAdd={() => { console.log("Add new module"); }}
                  onDelete={() => { console.log("Delete module"); }}
                  onEdit={() => { console.log("Edit module"); }}
                />
              </div>

              <div className="block md:hidden">
                <TableWithActionsMobile
                  data={modules}
                  error={error}
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
                  onAdd={() => { console.log("Add new module"); }}
                  onDelete={() => { console.log("Delete module"); }}
                  onEdit={() => { console.log("Edit module"); }}
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