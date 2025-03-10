/* eslint-disable unicorn/prevent-abbreviations */
import type React from 'react';
// eslint-disable-next-line no-duplicate-imports
import { useState, useEffect } from 'react';
import type { FarmRequest } from '../../../common/types';
import ButtonComponent from '../button/button';
import InputCustomComponent from '../input/input';

interface FarmModalProps {
  farm: FarmRequest | null;
  onClose: () => void;
  onSave: (farmData: FarmRequest) => void;
}

const FarmModal: React.FC<FarmModalProps> = ({ farm, onClose, onSave }) => {
  const [name, setName] = useState(farm?.name || '');
  const [address, setAddress] = useState(farm?.address || '');
  const [latitude, setLatitude] = useState(farm?.latitude || '');
  const [longitude, setLongitude] = useState(farm?.longitude || '');
  const [users, setUsers] = useState(farm?.users || []);

  useEffect(() => {
    if (farm) {
      setName(farm.name);
      setAddress(farm.address);
      setLatitude(farm.latitude);
      setLongitude(farm.longitude);
      setUsers(farm.users);
    }
  }, [farm]);

  const handleSubmit = (): void => {
    onSave({ name, address, latitude, longitude, users });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl"> 
        <h2 className="text-3xl font-bold mb-8 text-center text-primary">{farm ? 'Editar Granja' : 'Agregar Granja'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 

            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">Nombre de la Granja</label>
            <InputCustomComponent
              className="w-full p-3 border border-lightGray rounded focus:outline-none focus:ring-2 focus:ring-primary"
              name="name"
              placeholder="Nombre de la Granja"
              value={name}
              onChange={(_) => { setName(_.target.value); }}
            />
            <label className="block text-gray-700 font-bold mb-2" htmlFor="address">Dirección de la Granja</label>
            <InputCustomComponent
              className="w-full p-3 border border-lightGray rounded focus:outline-none focus:ring-2 focus:ring-primary"
              name="address"
              placeholder="Dirección de la Granja"
              value={address}
              onChange={(_) => { setAddress(_.target.value); }}
            />
            <label className="block text-gray-700 font-bold mb-2" htmlFor="latitude">Latitud</label>
            <InputCustomComponent
              className="w-full p-3 border border-lightGray rounded focus:outline-none focus:ring-2 focus:ring-primary"
              name="latitude"
              placeholder="Latitud"
              value={latitude}
              onChange={(_) => { setLatitude(_.target.value); }}
            />
            <label className="block text-gray-700 font-bold mb-2" htmlFor="longitude">Longitud</label>
            <InputCustomComponent
              className="w-full p-3 border border-lightGray rounded focus:outline-none focus:ring-2 focus:ring-primary"
              name="longitude"
              placeholder="Longitud"
              value={longitude}
              onChange={(_) => { setLongitude(_.target.value); }}
            />
            <label className="block text-gray-700 font-bold mb-2" htmlFor="users">Usuarios (IDs separados por comas)</label>
            <InputCustomComponent
              className="w-full p-3 border border-lightGray rounded focus:outline-none focus:ring-2 focus:ring-primary"
              name="users"
              placeholder="Usuarios (IDs separados por comas)"
              // eslint-disable-next-line @typescript-eslint/no-base-to-string
              value={users.join(',')}
              onChange={(_) => { setUsers(_.target.value.split(',').map(Number)); }}
            />
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <ButtonComponent className="bg-quaternary text-white px-6 py-3 rounded hover:bg-quinary" onClick={onClose}>Cancelar</ButtonComponent>
            <ButtonComponent className="bg-primary text-white px-6 py-3 rounded hover:bg-secondary" type="submit">{farm ? 'Guardar' : 'Agregar'}</ButtonComponent>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmModal;