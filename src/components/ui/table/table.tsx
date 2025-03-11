import { FaEdit, FaTrash } from 'react-icons/fa';
import type { User } from '../../../common/types';

interface UserTableProps {
  users: Array<User>;
  onDeleteUser: (userId: number) => void;
  onUpdateUser: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onDeleteUser, onUpdateUser }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md mt-4">
      <thead>
        <tr className="bg-blue-500 text-white uppercase text-sm leading-normal">
          <th className="py-3 px-6 text-left">ID</th>
          <th className="py-3 px-6 text-left">Nombre</th>
          <th className="py-3 px-6 text-left">Email</th>
          <th className="py-3 px-6 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {users.map((user, index) => (
          <tr key={user.id} className={`border-b border-gray-200 hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
            <td className="py-3 px-6 text-left whitespace-nowrap">{user.id}</td>
            <td className="py-3 px-6 text-left whitespace-nowrap">{user.name}</td>
            <td className="py-3 px-6 text-left whitespace-nowrap">{user.email}</td>
            <td className="py-3 px-6 text-left whitespace-nowrap">
              <div className="flex space-x-2">
                <button
                  className="bg-primary hover:bg-secondary text-white px-2 py-1 rounded flex items-center"
                  onClick={() => { onUpdateUser(user); }}
                >
                  <FaEdit className="mr-1" /> Editar
                </button>
                <button
                  className="bg-darkGray hover:bg-veryDark text-white px-2 py-1 rounded flex items-center"
                  onClick={() => { onDeleteUser(user.id); }}
                >
                  <FaTrash className="mr-1" /> Borrar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;