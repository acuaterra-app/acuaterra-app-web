import Spline from "@splinetool/react-spline";
import type { FC } from "react";

const SplineAnimation: FC = () => {
  return (
    <div className="w-full h-full flex justify-center items-center" style={{ background: "transparent" }}>
      <Spline
        scene="https://prod.spline.design/d29Mmlc8OyPhcyP4/scene.splinecode"
        style={{
          background: "transparent", // Aseguramos que el fondo de Spline sea transparente
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default SplineAnimation;