import type { FunctionComponent } from 'react';
// eslint-disable-next-line no-duplicate-imports
import { useState } from 'react';
import useBitacoras from '../hooks/useBitacoras';
import BitacoraTable from '../components/ui/table/bitacoraTable';
import EditBitacoraModal from '../components/ui/modals/editBitacoraModal';
import CreateBitacoraModal from '../components/ui/modals/createBitacoraModal';
import { useNavigate } from "@tanstack/react-router";
import { updateBitacora, createBitacora, deleteBitacora } from '../services/bitacoraService';
import type { Bitacora as BitacoraType, UpdateBitacoraRequest, CreateBitacoraRequest } from '../common/types';
import Layout from '../components/layout/layout';
import closeSessionIcon from "../assets/images/cerrar-sesion.png";
import userIcon from "../assets/images/userlogo.png";
import moduleIcon from "../assets/images/module.png";
import homeIcon from "../assets/images/home.png";
// borramos importaciones innecesarias


export const Bitacoras: FunctionComponent = () => {
    const navigate = useNavigate();
    const [reload, setReload] = useState(false);
    const { bitacoras, loading, error } = useBitacoras(reload);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [selectedBitacora, setSelectedBitacora] = useState<BitacoraType>({} as BitacoraType);

    // Manejar la edición de una bitácora
    const handleEdit = (bitacora: BitacoraType): void => {
        setSelectedBitacora(bitacora);
        setEditModalOpen(true);
    };

    // Manejar la eliminación de una bitácora
    const handleDelete = async (bitacoraId: number): Promise<void> => {
        await deleteBitacora(bitacoraId);
        setReload(!reload); // Recargar la lista de bitácoras
    };

    // Manejar la actualización de una bitácora
    const handleSave = async (bitacoraData: UpdateBitacoraRequest): Promise<void> => {
        if (selectedBitacora) {
             
            await updateBitacora(selectedBitacora.id_bitacora, bitacoraData);
            setEditModalOpen(false);
            setReload(!reload); // Recargar la lista de bitácoras
        }
    };
 
    const handleCreate = async (bitacoraData: CreateBitacoraRequest): Promise<void> => {
        await createBitacora(bitacoraData);
        setCreateModalOpen(false);
        setReload(!reload); // Recargar la lista de bitácoras
    };

    return (
        <Layout>
            <div className="flex min-h-screen bg-white">
                
                <aside className="w-64 bg-gray-300 border-r border-gray-300 flex flex-col">
                    <div className="p-4 flex flex-col items-center">
                        <img alt="Acuaterra Logo" className="h-16 mb-2" src={acuaterraLogo} />
                        <p className="text-gray-700 font-semibold">Bienvenido, usuario!</p>
                    </div>
                    <nav className="flex-1">
                        <ul className="space-y-20 mt-20">
                            <li
                                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                                onClick={() => navigate({ to: "/newHome" })}
                            >
                                <img alt="Inicio" className="h-6 w-6 mr-2" src={homeIcon} />
                                <span className="font-bold">Inicio</span>
                            </li>
                            <li 
                                 className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                                 onClick={() => navigate({ to: "/users" })}
                                 >
                                <img alt="Usuarios" className="h-6 w-6 mr-2" src={userIcon} />
                                <span className="font-bold">Usuarios</span>
                            </li>
                            <li
                                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                                onClick={() => navigate({ to: "/module" })}
                            >
                                <img alt="Módulos" className="h-6 w-6 mr-2" src={moduleIcon} />
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
                                className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                            >
                                <img alt="Bitácora" className="h-6 w-6 mr-2" src={binnacleIcon} />
                                <span className="font-bold">Bitácoras</span>
                            </li>
                        </ul>
                        
                        <div className="mt-60">
                            <ul className="space-y-4">
                                <li
                                    className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:scale-105"
                                    onClick={() => navigate({ to: "/auth" })}
                                >
                                    <img alt="Cerrar Sesión" className="h-6 w-6 mr-2" src={closeSessionIcon} />
                                    <span className="font-bold">Cerrar Sesión</span>
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

                
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-bold mb-4">Lista de Bitácoras</h1>
                    <button
                        className="mt-4 bg-green-500 text-white p-2 rounded"
                        onClick={() => { setCreateModalOpen(true); }}
                    >
                        Registrar Nueva Bitácora
                    </button>
                    {loading && <p className="mt-4 text-gray-600">Cargando...</p>}
                    {error && <p className="mt-4 text-red-500">Error: {String(error)}</p>}
                    <div className="mt-4 overflow-x-auto">
                        <BitacoraTable
                            bitacoras={bitacoras}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    </div>
                    <EditBitacoraModal
                        bitacora={selectedBitacora}
                        isOpen={isEditModalOpen}
                        setIsOpen={setEditModalOpen}
                        onSave={handleSave}
                    />
                    <CreateBitacoraModal
                        isOpen={isCreateModalOpen}
                        setIsOpen={() => { setCreateModalOpen(false); }}
                        onCreate={handleCreate}
                    />
                </main>
            </div>
        </Layout>
    );
};