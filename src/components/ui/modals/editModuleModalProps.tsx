import type React from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState } from "react";
import type { UpdateModuleRequest, ModuleType } from "../../../common/types";

interface EditModuleModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    module: ModuleType;
    onSave: (moduleData: UpdateModuleRequest) => void;
}

const EditModuleModal: React.FC<EditModuleModalProps> = ({ isOpen, setIsOpen, module, onSave }) => {
    const [nombre, setNombre] = useState(module.nombre);
    const [ubicacion, setUbicacion] = useState(module.ubicacion);
    const [especiePescados, setEspeciePescados] = useState(module.especie_pescados);
    const [cantidadPescados, setCantidadPescados] = useState(module.cantidad_pescados);
    const [edadPescados, setEdadPescados] = useState(module.edad_pescados);
    const [dimensiones, setDimensiones] = useState(module.dimensiones);

    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault();
        const updatedModuleData: UpdateModuleRequest = {
            nombre,
            ubicacion,
            // eslint-disable-next-line camelcase
            especie_pescados: especiePescados,
            // eslint-disable-next-line camelcase
            cantidad_pescados: cantidadPescados,
            // eslint-disable-next-line camelcase
            edad_pescados: edadPescados,
            dimensiones,
			// eslint-disable-next-line camelcase
			id_persona: module.id_persona_modulo,
        };
        onSave(updatedModuleData);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded">
                <h2 className="text-xl mb-4">Editar Módulo</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Nombre</label>
                        <input
                            required
                            className="border p-2 w-full"
                            type="text"
                            value={nombre}
                            onChange={(_) => { setNombre(_.target.value); }}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Ubicación</label>
                        <input
                            required
                            className="border p-2 w-full"
                            type="text"
                            value={ubicacion}
                            onChange={(_) => { setUbicacion(_.target.value); }}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Especie de Pescados</label>
                        <input
                            required
                            className="border p-2 w-full"
                            type="text"
                            value={especiePescados}
                            onChange={(_) => { setEspeciePescados(_.target.value); }}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Cantidad de Pescados</label>
                        <input
                            required
                            className="border p-2 w-full"
                            type="number"
                            value={cantidadPescados}
                            onChange={(_) => { setCantidadPescados(_.target.value); }}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Edad de Pescados</label>
                        <input
                            required
                            className="border p-2 w-full"
                            type="text"
                            value={edadPescados}
                            onChange={(_) => { setEdadPescados(_.target.value); }}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Dimensiones</label>
                        <input
                            required
                            className="border p-2 w-full"
                            type="text"
                            value={dimensiones}
                            onChange={(_) => { setDimensiones(_.target.value); }}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button className="mr-2 p-2 bg-gray-500 text-white" type="button" onClick={() => { setIsOpen(false); }}>
                            Cancelar
                        </button>
                        <button className="p-2 bg-blue-500 text-white" type="submit">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModuleModal;