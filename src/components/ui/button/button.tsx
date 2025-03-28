import type { FC, MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  disabled?: boolean;
  className?: string; // new prop for custom classes
}

const ButtonComponent: FC<ButtonProps> = ({
  type = "button",
  onClick,
  children,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      // combine the default class with the one passed as a prop
      className={`button-component ${className}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonComponent;
