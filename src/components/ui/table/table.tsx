import type React from "react";
import type { User } from "../../../common/types";

interface UserTableProps {
	users: Array<User>;
	onDeleteUser: (userId: number) => void;
	onUpdateUser: (userData: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onDeleteUser, onUpdateUser  }) => {
	return (
		<table className="min-w-full bg-white">
			<thead>
				<tr>
					<th className="py-2">ID</th>
					<th className="py-2">Nombre</th>
					<th className="py-2">Email</th>
					<th className="py-2">Documento</th>
					<th className="py-2">Sede</th>
					<th className="py-2">Rol</th>
					<th className="py-2">Acciones</th>
				</tr>
			</thead>
			<tbody>
				{users.map((user) => (
					<tr key={user.id}>
						<td className="py-2">{user.id}</td>
						<td className="py-2">{user.name}</td>
						<td className="py-2">{user.email}</td>
						<td className="py-2">{user.n_documento_identidad}</td>
						<td className="py-2">{user.sede}</td>
						<td className="py-2">{user.rol}</td>
						<td className="py-2">
							<button className="bg-primary hover:bg-secondary text-white px-2 py-1 rounded" onClick={() => { onUpdateUser(user); }}>
								Editar
							</button>
							<button className="bg-darkGray hover:bg-veryDark text-white px-2 py-1 rounded ml-2"   onClick={() => { onDeleteUser(user.id); }}>
								Eliminar
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default UserTable;
