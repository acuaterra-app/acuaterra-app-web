import type React from "react";
import type { ModuleType } from "../../../common/types";

interface ModuleTableProps {
    modules: Array<ModuleType>;
    onDelete: (moduleId: number) => void;
    onEdit: (module: ModuleType) => void;
}

const ModuleTable: React.FC<ModuleTableProps> = ({ modules, onDelete, onEdit }) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                    <th className="py-2">ID</th>
                    <th className="py-2">Nombre</th>
                    <th className="py-2">Descripción</th>
                    <th className="py-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {modules.map((module) => (
                    <tr key={module.id_modulo}>
                        <td className="py-2">{module.id_modulo}</td>
                        <td className="py-2">{module.nombre}</td>
                        <td className="py-2">{module.dimensiones}</td>
                        <td className="py-2">
                            <button className="bg-primary hover:bg-secondary text-white px-2 py-1 rounded" onClick={() => { onEdit(module); }}>
                                Editar
                            </button>
                            <button className="bg-darkGray hover:bg-veryDark text-white px-2 py-1 rounded ml-2" onClick={() => { onDelete(module.id_modulo); }}>
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ModuleTable;