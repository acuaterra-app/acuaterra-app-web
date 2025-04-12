/* eslint-disable no-use-before-define */
import { useState, type FC, Suspense } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import styled from "styled-components";
import acuaterraLogo from "../assets/images/logo.png";
import LoaderAcua from "../components/loaders/LoaderAcua";
// eslint-disable-next-line no-duplicate-imports
import { lazy } from "react";

// Lazy load the SplineAnimation component
const SplineAnimation = lazy(() => import("../components/ui/SplineAnimation"));

const Welcome: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = (): void => {
    setLoading(true);
    setTimeout(() => {
      void navigate({ to: "/auth" });
    }, 1500);
  };

  if (loading) {
    return <LoaderAcua />;
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 font-sans p-6"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Left Section */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/2 flex flex-col items-center justify-center text-center space-y-4"
        initial={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animation Logo */}
        <motion.img
          alt="Acuaterra Logo"
          animate={{ opacity: 1, y: 0 }}
          className="h-20 md:h-32 lg:h-40 mb-4"
          initial={{ opacity: 0, y: -50 }}
          src={acuaterraLogo}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
          whileHover={{ rotate: 10, scale: 1.05 }}
        />

        {/* Title */}
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
          ¡Bienvenidos a Acuaterra!
        </h1>

        {/* Start Button */}
        <StyledWrapper>
          <button className="btn" onClick={handleStart}>
            <span className="btn-text-one">Hola!</span>
            <span className="btn-text-two">¡Comenzar!</span>
          </button>
        </StyledWrapper>

        {/* Footer */}
        <footer className="text-sm md:text-base font-medium text-gray-800 mt-4">
          <p>© 2023 Acuaterra. Todos los derechos reservados.</p>
        </footer>
      </motion.div>

      {/* Right Section with Spline Animation */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex md:w-1/2 justify-center"
        initial={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.6 }}
      >
        <Suspense fallback={<LoaderAcua />}>
          <SplineAnimation />
        </Suspense>
      </motion.div>
    </motion.div>
  );
};

const StyledWrapper = styled.div`
  .btn {
    width: 100px;
    height: 40px;
    background: linear-gradient(to top, #44cbd3, #3cacac); /* Respetamos la paleta de colores */
    color: #fff;
    border-radius: 25px;
    border: none;
    outline: none;
    cursor: pointer;
    position: relative;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }

  .btn span {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: top 0.5s;
  }

  .btn-text-one {
    position: absolute;
    width: 100%;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  .btn-text-two {
    position: absolute;
    width: 100%;
    top: 150%;
    left: 0;
    transform: translateY(-50%);
  }

  .btn:hover .btn-text-one {
    top: -100%;
  }

  .btn:hover .btn-text-two {
    top: 50%;
  }
`;

export default Welcome;