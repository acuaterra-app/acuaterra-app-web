import type React from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState } from "react";
import type { UserRequestV2 } from "../../../common/types";

interface RegisterUserModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    onRegister: (user: UserRequestV2) => void;
}

const RegisterUserModal: React.FC<RegisterUserModalProps> = ({
    showModal,
    setShowModal,
    onRegister,
}) => {
    const [newUser, setNewUser] = useState<UserRequestV2>({
        name: "",
        email: "",
        dni: "",
        // eslint-disable-next-line camelcase
        id_rol: 3,
        address: "",
    });

    const handleRegister = (): void => {
        onRegister(newUser);
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded">
                <h2>Register User</h2>
                <input
                    className="mb-2 p-2"
                    placeholder="Name"
                    type="text"
                    value={newUser.name}
                    onChange={(_) => {
                        setNewUser({ ...newUser, name: _.target.value });
                    }}
                />
                <input
                    className="mb-2 p-2"
                    placeholder="Email"
                    type="email"
                    value={newUser.email}
                    onChange={(_) => {
                        setNewUser({ ...newUser, email: _.target.value });
                    }}
                />
                <input
                    className="mb-2 p-2"
                    placeholder="Document ID"
                    type="text"
                    value={newUser.dni}
                    onChange={(_) => {
                        setNewUser({ ...newUser, dni: _.target.value });
                    }}
                />
                <input
                    className="mb-2 p-2"
                    placeholder="Role ID"
                    type="number"
                    value={newUser.id_rol}
                    onChange={(_) => {
                        // eslint-disable-next-line camelcase
                        setNewUser({ ...newUser, id_rol: Number(_.target.value) });
                    }}
                />
                <input
                    className="mb-2 p-2"
                    placeholder="Address"
                    type="text"
                    value={newUser.address}
                    onChange={(_) => {
                        setNewUser({ ...newUser, address: _.target.value });
                    }}
                />
                <button className="bg-blue-500 text-white p-2" onClick={handleRegister}>
                    Register
                </button>
                <button
                    className="bg-red-500 text-white p-2 ml-2"
                    onClick={() => {
                        setShowModal(false);
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
export default RegisterUserModal;