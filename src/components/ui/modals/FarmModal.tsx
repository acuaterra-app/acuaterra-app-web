import type React from 'react';
// eslint-disable-next-line no-duplicate-imports
import { useState, useEffect } from 'react';
import type { FarmRequest } from '../../../common/types';
import ButtonComponent from '../../ui/button/button';
import InputCustomComponent from '../../ui/input/input';

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
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl font-bold mb-4">{farm ? 'Editar Granja' : 'Agregar Granja'}</h2>
        <InputCustomComponent
          name="name"
          placeholder="Nombre de la Granja"
          value={name}
          onChange={(_) => { setName(_.target.value); }}
        />
        <InputCustomComponent
          name="address"
          placeholder="Dirección de la Granja"
          value={address}
          onChange={(_) => { setAddress(_.target.value); }}
        />
        <InputCustomComponent
          name="latitude"
          placeholder="Latitud"
          value={latitude}
          onChange={(_) => { setLatitude(_.target.value); }}
        />
        <InputCustomComponent
          name="longitude"
          placeholder="Longitud"
          value={longitude}
          onChange={(_) => { setLongitude(_.target.value); }}
        />
        <InputCustomComponent
          name="users"
          placeholder="Usuarios (IDs separados por comas)"
          value={users.join(',')}
          onChange={(_) => { setUsers(_.target.value.split(',').map(Number)); }}
        />
        <div className="flex justify-end mt-4">
          <ButtonComponent className="mr-2" onClick={onClose}>Cancelar</ButtonComponent>
          <ButtonComponent onClick={handleSubmit}>{farm ? 'Guardar' : 'Agregar'}</ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default FarmModal;