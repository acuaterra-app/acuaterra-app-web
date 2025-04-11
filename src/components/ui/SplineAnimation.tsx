import Spline from "@splinetool/react-spline";
import type { FC } from "react";

const SplineAnimation: FC = () => {
  return (
    <div
      className="w-full h-full flex justify-center items-center"
      style={{
        background: "transparent",
        marginLeft: "400px", 
      }}
    >
      <Spline
        scene="https://prod.spline.design/die5ufQGg5C51BXN/scene.splinecode"
        style={{
          background: "transparent", 
         
        }}
      />
    </div>
  );
};

export default SplineAnimation;