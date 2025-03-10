import type { FC, ChangeEventHandler } from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState } from "react";
import showIcon from "../../../assets/images/showIconW.png";
import hideIcon from "../../../assets/images/hideIconW.png";

interface InputProps {
	name: string;
	value: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
	placeholder?: string;
	error?: string;
	type?: string;
}

const InputCustomComponent: FC<InputProps> = ({
	name,
	value,
	onChange,
	placeholder,
	error,
	type = "text",
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const toggleShowPassword = (): void => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="input-component relative">
		  <input
			required
			className="input-field w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#44cbd3]"
			name={name}
			placeholder={placeholder}
			type={type === "password" && showPassword ? "text" : type}
			value={value}
			onChange={onChange}
		  />
		  {type === "password" && (
			<button
			  className="toggle-password absolute right-3 top-1/2 transform -translate-y-1/2"
			  type="button"
			  onClick={toggleShowPassword}
			>
			  <img
				alt={showPassword ? "Hide password" : "Show password"}
				className="w-6 h-6"
				src={showPassword ? hideIcon : showIcon}
			  />
			</button>
		  )}
		  {error && <span className="error text-[#FF0000] text-sm mt-1">{error}</span>}
		</div>
	  );
};

export default InputCustomComponent;
