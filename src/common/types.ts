export type FunctionComponent = React.ReactElement | null;

type HeroIconSVGProps = React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> &
	React.RefAttributes<SVGSVGElement>;
type IconProps = HeroIconSVGProps & {
	title?: string;
	titleId?: string;
};
export type Heroicon = React.FC<IconProps>;
export interface Module {
	id_modulo: number;
	nombre: string;
	ubicacion: string;
	especie_pescados: string;
	cantidad_pescados: string;
	edad_pescados: string;
	dimensiones: string;
	id_persona_modulo: number;
	nombre_persona_modulo: string;
	id_persona_asignada: number | null;
	nombre_persona_asignada: string | null;
}

export interface CreateModuleRequest {
	nombre: string;
	ubicacion: string;
	especie_pescados: string;
	cantidad_pescados: number;
	edad_pescados: number;
	dimensiones: string;
	id_persona: number;
}

export interface UpdateModuleRequest {
	nombre: string;
	ubicacion: string;
	especie_pescados: string;
	cantidad_pescados: string;
	edad_pescados: string;
	dimensiones: string;
	id_persona: number;
}

export interface User {
	id: number;
	name: string;
	email: string;
	n_documento_identidad: string;
	sede: string;
	rol: string;
	usuario_ficha: string | null;
	jornada: string | null;
	usuario_programa: string | null;
	instructor_ficha: string | null;
	instructor_programa: string | null;
}
export interface UserRequest {
	nombre: string;
	email: string;
	password: string;
	n_documento_identidad?: string;
	sede?: string;
	id_rol?: number;
	rol?: number;
	n_ficha?: string;
	jornada?: string;
	nombre_del_programa?: string;
}

export interface UserRequestV2 {
    name: string;
    email: string;
    dni: string;
    id_rol: number;
    address?: string;
}
export interface Bitacora {
	id_bitacora: number;
	id_modulo: number;
	fecha: string;
	descripcion: string;
}

export interface CreateBitacoraRequest {
	id_modulo: number;
	fecha: string;
	descripcion: string;
}

export interface UpdateBitacoraRequest {
	id_modulo: number;
	fecha: string;
	descripcion: string;
}
export interface Farm {
	id: number;
	name: string;
	address: string;
	latitude: string;
	longitude: string;
	createdAt: string;
	updatedAt: string;
	users: Array<User> | Array<number>;
}

export interface FarmRequest {
	id?: number;
	name: string;
	address: string;
	latitude: string;
	longitude: string;
	users: Array<User> | Array<number>;
}

export interface TableItem {
	id: number;
}

export interface TableColumn<T> {
	header: string;
	accessor: keyof T;
	render?: (item: T) => React.ReactNode;
}

export interface ResponseType<T> {
	message: string;
	data: Array<T>;
	errors: Array<string>;
	meta: {
		pagination: {
			total: number;
			hasNext: boolean;
			hasPrev: boolean;
		};
	};
}

export interface UserRole {
	name: string;
}

export interface UserResponse {
	id: number;
	name: string;
	email: string;
	dni: string;
	id_rol: number;
	address: string;
	createdAt: string;
	updatedAt: string;
	rol: UserRole;
}
