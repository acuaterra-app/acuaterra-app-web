import { useState, useEffect } from "react";
// eslint-disable-next-line no-duplicate-imports
import type { FunctionComponent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFarms from "../hooks/useFarms";
import TableWithActions from "../components/ui/table/tableWithActions";
import FarmModal from "../components/ui/modals/FarmModal";
import type { FarmRequest, User } from "../common/types";
import LogoutButton from "../components/ui/button/logoutButton";
import acuaterraLogo from "../assets/images/logo.png";
import homeIcon from "../assets/images/home.png";
import moduleIcon from "../assets/images/module.png";
import reportIcon from "../assets/images/reporte.png";
import userIcon from "../assets/images/userlogo.png";
import fishIcon from "../assets/images/pez.png";
import LoaderAcua from "../components/loaders/LoaderAcua";
import { Menu, X } from "lucide-react";

const FarmsPage: FunctionComponent = () => {
  const {
    farms,
    loading,
    error,
    total,
    page,
    limit,
    setPage,
    setLimit,
    addFarm,
    editFarm,
    removeFarm,
  } = useFarms();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<FarmRequest | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddFarm = async (farmData: FarmRequest): Promise<void> => {
    await addFarm(farmData);
    setIsModalOpen(false);
    toast.success("Granja agregada exitosamente!");
  };

  const handleEditFarm = async (farmData: FarmRequest): Promise<void> => {
    if (selectedFarm) {
      const userIds = farmData.users.map((user) =>
        typeof user === "object" ? user.id : user
      );
      const updatedFarmData = { ...farmData, users: userIds };
      await editFarm(selectedFarm.id as number, updatedFarmData);
    }
    setIsModalOpen(false);
    toast.success("Granja editada exitosamente!");
  };

  const handleRemoveFarm = async (farmId: number): Promise<void> => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta granja?"
    );
    if (confirmed) {
      await removeFarm(farmId);
      toast.success("Granja eliminada exitosamente!");
    }
  };

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
    <div className="flex min-h-screen font-sans bg-white relative overflow-x-auto">
      <ToastContainer />

      <button
        className="absolute top-9 left-4 z-50 bg-gray-300 p-2 rounded shadow-md md:hidden"
        id="menu-button"
        onClick={() => { setIsOpen(!isOpen); }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        id="sidebar"
        className={`fixed top-0 left-0 w-64 h-screen bg-gray-300 border-r border-gray-300 flex flex-col transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:w-64 md:relative`}
      >
        <div className="p-4 flex flex-col items-center relative">
          <button
            className="absolute top-2 right-2 p-2 text-gray-700 hover:text-gray-900 md:hidden"
            onClick={() => { setIsOpen(false); }}
          >
            <X size={24} />
          </button>

          <img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
          <p className="text-gray-700 font-semibold">Bienvenido, usuario!</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-3 md:space-y-20 mt-4 md:mt-20">
            
            <li
              className="
                flex items-center justify-center gap-3 p-2
                cursor-pointer transition-all duration-300
                transform origin-center overflow-hidden
                hover:bg-gray-400 hover:scale-102
                rounded-lg
              "
              onClick={async () => {
                await navigate({ to: "/newHome" });
                setIsOpen(false);
              }}
            >
              <img alt="Home" className="h-6 w-6" src={homeIcon} />
              <span className="font-bold">Inicio</span>
            </li>

            <li
              className="
                flex items-center justify-center gap-3 p-2
                cursor-pointer transition-all duration-300
                transform origin-center overflow-hidden
                hover:bg-gray-400 hover:scale-102
                bg-gray-400 text-white border-2 border-gray-400
                rounded-lg
              "
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <img alt="Granjas" className="h-6 w-6" src={moduleIcon} />
              <span className="font-bold">Granjas</span>
            </li>

            <li
              className="
                flex items-center justify-center gap-3 p-2
                cursor-pointer transition-all duration-300
                transform origin-center overflow-hidden
                hover:bg-gray-400 hover:scale-102
                rounded-lg
              "
              onClick={async () => {
                await navigate({ to: "/users" });
                setIsOpen(false);
              }}
            >
              <img alt="Usuarios" className="h-6 w-6" src={userIcon} />
              <span className="font-bold">Usuarios</span>
            </li>

            <li
              className="
                flex items-center justify-center gap-3 p-2
                cursor-pointer transition-all duration-300
                transform origin-center overflow-hidden
                hover:bg-gray-400 hover:scale-102
                rounded-lg
              "
              onClick={async () => {
                await navigate({ to: "/module" });
                setIsOpen(false);
              }}
            >
              <img alt="Módulos" className="h-6 w-6" src={fishIcon} />
              <span className="font-bold">Módulos</span>
            </li>

            <li
              className="
                flex items-center justify-center gap-3 p-2
                cursor-pointer transition-all duration-300
                transform origin-center overflow-hidden
                hover:bg-gray-400 hover:scale-102
                rounded-lg
              "
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
        </nav>

        <div className="p-0">
          <p className="text-center text-xs mt-2">
            versión 1.0 <br />
            Advanced Aquaponics Monitoring System
          </p>
        </div>
      </aside>

      <main className="flex-1 p-9 bg-white md:ml-0">
        <h1 className="text-2xl font-bold mb-4 text-center">Granjas</h1>

        {loading ? (
          <LoaderAcua />
        ) : (
          <div className="border border-gray-300 rounded-lg p-1 shadow-md">
            <TableWithActions
              data={farms}
              error={error}
              limit={limit}
              loading={loading}
              page={page}
              setLimit={setLimit}
              setPage={setPage}
              total={total}
              columns={[
                { header: "ID", accessor: "id" },
                { header: "Name", accessor: "name" },
                { header: "Latitud", accessor: "latitude" },
                { header: "Longitud", accessor: "longitude" },
                { header: "Dirección", accessor: "address" },
                { header: "Date", accessor: "createdAt" },
                {
                  header: "Users",
                  accessor: "users",
                  render: (farm) =>
                    farm.users.map((user) => (user as User).name).join(", "),
                },
              ]}
              onDelete={handleRemoveFarm}
              onAdd={() => {
                setSelectedFarm(null);
                setIsModalOpen(true);
              }}
              onEdit={(farm: FarmRequest) => {
                setSelectedFarm(farm);
                setIsModalOpen(true);
              }}
            />
          </div>
        )}

        {isModalOpen && (
          <FarmModal
            farm={selectedFarm}
            onClose={() => { setIsModalOpen(false); }}
            onSave={selectedFarm ? handleEditFarm : handleAddFarm}
          />
        )}
      </main>
    </div>
  );
};

export default FarmsPage;
