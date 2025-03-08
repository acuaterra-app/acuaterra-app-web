import type React from 'react';
import ButtonComponent from '../button/button';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <ButtonComponent className="mr-2" onClick={onCancel}>Cancelar</ButtonComponent>
          <ButtonComponent onClick={onConfirm}>Aceptar</ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;