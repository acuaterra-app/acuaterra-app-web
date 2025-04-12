import Spline from "@splinetool/react-spline";
import type { FC } from "react";

const SplineAnimation: FC = () => {
  return (
    <div
      className="w-full h-full flex justify-center items-center"
      style={{
        background: "transparent",
      }}
    >
      <Spline
        scene="https://prod.spline.design/die5ufQGg5C51BXN/scene.splinecode"
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "600px", // Limita el ancho máximo
          maxHeight: "990px", // Limita la altura máxima
          background: "transparent",
        }}
      />
    </div>
  );
};

export default SplineAnimation;