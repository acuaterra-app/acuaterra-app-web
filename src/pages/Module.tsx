import type { FunctionComponent } from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState, useEffect } from "react";
import useModules from "../hooks/useModules";
import ModuleTable from "../components/ui/table/moduleTable";
import EditModuleModal from "../components/ui/modals/editModuleModalProps";
import CreateModuleModal from "../components/ui/modals/createModuleModal";
import SearchModuleInput from "../components/ui/searchBar/searchBar";
import { useNavigate } from "@tanstack/react-router";
import { updateModule, createModule, deleteModule } from "../services/moduleService";
import type { Module as ModuleType, UpdateModuleRequest, CreateModuleRequest } from "../common/types";
import Layout from "../components/layout/layout";
import closeSessionIcon from "../assets/images/cerrar-sesion.png";
import userIcon from "../assets/images/userlogo.png";
import moduleIcon from "../assets/images/module.png";
import homeIcon from "../assets/images/home.png";
import acuaterraLogo from "../assets/images/logo.png";
import reportIcon from "../assets/images/reporte.png";
import fishIcon from "../assets/images/pez.png";
import LoaderAcua from "../components/loaders/LoaderAcua";
import { Menu, X } from "lucide-react";

export const Module: FunctionComponent = () => {
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const { modules, loading, error } = useModules(reload);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleType>({} as ModuleType);
  const [searchTerm, setSearchTerm] = useState("");

  
  const [isOpen, setIsOpen] = useState(false);

  
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

  // Bloquea scroll vertical al abrir menú en móvil
  useEffect(() => {
    document.body.style.overflowY = isOpen ? "hidden" : "auto";
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [isOpen]);

  // CRUD
  const handleEdit = (module: ModuleType): void => {
    setSelectedModule(module);
    setEditModalOpen(true);
    setReload(!reload);
  };

  const handleDelete = async (moduleId: number): Promise<void> => {
    await deleteModule(moduleId);
    setReload(!reload);
  };

  const handleSave = async (moduleData: UpdateModuleRequest): Promise<void> => {
    if (selectedModule) {
      await updateModule(selectedModule.id_modulo, moduleData);
      setEditModalOpen(false);
      setReload(!reload);
    }
  };

  const handleCreate = async (moduleData: CreateModuleRequest): Promise<void> => {
    await createModule(moduleData);
    setCreateModalOpen(false);
    setReload(!reload);
  };

  // Búsqueda
  const handleSearchChange = (term: string): void => {
    setSearchTerm(term);
  };
  const filteredModules = modules.filter((m) =>
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoaderAcua />;
  }

  return (
    <Layout>
      <div className="flex min-h-screen bg-white font-sans relative">
        
        <button
          className="absolute top-4 left-4 z-50 bg-gray-300 p-2 rounded shadow-md md:hidden"
          id="menu-button"
          onClick={() => { setIsOpen(!isOpen); }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

       
        <aside
          id="sidebar"
          className={`fixed top-0 left-0 w-64 h-screen bg-gray-300 border-r border-gray-400 flex flex-col transform transition-transform duration-300 ease-in-out z-50
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:w-64 md:relative`}
        >
          <div className="p-4 flex flex-col items-center">
            <img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
            <p className="text-gray-800 font-semibold">Bienvenido, usuario!</p>
          </div>
          <nav className="flex-1">
            
            <ul className="space-y-3 md:space-y-20 mt-4 md:mt-20">
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
                onClick={() => navigate({ to: "/newHome" })}
              >
                <img alt="Inicio" className="h-6 w-6 mr-2" src={homeIcon} />
                <span className="font-bold">Inicio</span>
              </li>
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
                onClick={() => navigate({ to: "/farm" })}
              >
                <img alt="Módulos" className="h-6 w-6 mr-2" src={moduleIcon} />
                <span className="font-bold">Granjas</span>
              </li>
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
                onClick={() => navigate({ to: "/users" })}
              >
                <img alt="Usuarios" className="h-6 w-6 mr-2" src={userIcon} />
                <span className="font-bold">Usuarios</span>
              </li>
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105 bg-gray-400 text-white border-2 border-gray-400 rounded-lg"
                onClick={() => navigate({ to: "/module" })}
              >
                <img alt="Módulos" className="h-6 w-6 mr-2" src={fishIcon} />
                <span className="font-bold">Módulos</span>
              </li>
              <li
                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                onClick={() => navigate({ to: "/report" })}
              >
                <img alt="Reporte" className="h-6 w-6 mr-2" src={reportIcon} />
                <span className="font-bold">Reporte</span>
              </li>
              <li
                  className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-400 hover:scale-105"
                  onClick={() => navigate({ to: "/auth" })}
                >
                  <img alt="Cerrar Sesión" className="h-6 w-6 mr-2" src={closeSessionIcon} />
                  <span className="font-bold">Cerrar Sesión</span>
                </li>
            </ul>
            <div className="mt-20">
              <ul className="space-y-4">
               
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

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Lista de Módulos</h1>
          <SearchModuleInput onSearchChange={handleSearchChange} />
          <br />
          <button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
            onClick={() => { setCreateModalOpen(true); }}
          >
            Registrar Nuevo Módulo
          </button>
          {error && <p className="mt-4 text-red-500">Error: {error}</p>}
          <div className="mt-4 overflow-x-auto">
            <ModuleTable modules={filteredModules} onDelete={handleDelete} onEdit={handleEdit} />
          </div>
          <EditModuleModal
            isOpen={isEditModalOpen}
            module={selectedModule}
            setIsOpen={setEditModalOpen}
            onSave={handleSave}
          />
          <CreateModuleModal
            isOpen={isCreateModalOpen}
            onClose={() => { setCreateModalOpen(false); }}
            onCreate={handleCreate}
          />
        </main>
      </div>
    </Layout>
  );
};

export default Module;
