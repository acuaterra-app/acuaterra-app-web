/* eslint-disable no-use-before-define */
import { useState, type FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform } from "framer-motion";
import styled from "styled-components";
import acuaterraLogo from "../assets/images/logo.png";
import phoneHome from "../assets/images/mockup-phone.png";
import LoaderAcua from "../components/loaders/LoaderAcua";

const Welcome: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleMouseMove = (event: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left - width / 2;
    const y = clientY - top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

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
      className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 font-sans p-8"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.8 }} 
    >
      {/* Sección izquierda */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/2 flex flex-col items-center justify-center text-center space-y-6"
        initial={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.6 }} 
      >
        {/* Animation Logo */}
        <motion.img
          alt="Acuaterra Logo"
          animate={{ opacity: 1, y: 0 }}
          className="h-24 md:h-[250px] mb-4"
          initial={{ opacity: 0, y: -50 }}
          src={acuaterraLogo}
          transition={{ type: "spring", stiffness: 80, damping: 12 }} 
          whileHover={{ rotate: 10, scale: 1.1 }} 
        />

        {/* Títle */}
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
          ¡Bienvenidos a Acuaterra!
        </h1>

        {/* Start Buttom */}
        <StyledWrapper>
          <button className="btn" onClick={handleStart}>
            <span className="btn-text-one">Hola!</span>
            <span className="btn-text-two">¡Comenzar!</span>
          </button>
        </StyledWrapper>

        {/* Footer */}
        <footer className="text-1xl md:text font-bold text-gray-800 mb-4">
          <p>© 2023 Acuaterra. Todos los derechos reservados.</p>
        </footer>
      </motion.div>

      {/* Right Section */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex md:w-1/2 justify-center"
        initial={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.6 }} 
        onMouseMove={handleMouseMove}
      >
        <motion.img
          alt="Vista de la app en teléfono"
          className="max-h-[800px] object-contain"
          src={phoneHome}
          whileHover={{ scale: 1.05 }}
          style={{
            rotateX,
            rotateY,
            willChange: "transform",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const StyledWrapper = styled.div`
  .btn {
    width: 140px;
    height: 50px;
    background: linear-gradient(to top, #44cbd3, #3cacac); /* Respetamos la paleta de colores */
    color: #fff;
    border-radius: 50px;
    border: none;
    outline: none;
    cursor: pointer;
    position: relative;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
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