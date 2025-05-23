/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { FC } from "react";
// eslint-disable-next-line no-duplicate-imports
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import HamburgerMenuButton from "../components/ui/button/HamburgerMenuButton";
import homeIcon from "../assets/images/home.png";
import moduleIcon from "../assets/images/module.png";
import acuaterraLogo from "../assets/images/logo.png";
import LogoutButton from "../components/ui/button/logoutButton";
import reportIcon from "../assets/images/reporte.png";
import userIcon from "../assets/images/userlogo.png";
import fishIcon from "../assets/images/pez.png";
import foto1 from "../assets/images/fotoAcuapico_1.jpg";
import foto2 from "../assets/images/fotoAcuapico_2.jpg";
import foto3 from "../assets/images/fotoAcuapico_3.jpg";
import { Carousel } from "../components/Slider/Carousel";
import styled from "styled-components";
import { isTokenValid } from "../common/isTokenValid";
import MobileCarousel from "../components/Slider/MobileCarousel";
import FarmsPieChart from "../components/DashBoard/FarmsPieChart";
import ModulesPieChart from "../components/DashBoard/ModulesPieChart";
import TotalFarmsCard from "../components/DashBoard/TotalFarmsCard";
import TotalModulesCard from "../components/DashBoard/TotalModulesCard";
import TotalUsersCard from "../components/DashBoard/TotalUsersCard";
import NotificationsAreaChart from "../components/DashBoard/NotificationsAreaChart";
import { useDashboardMetrics, useDashboardStats, useNotificationStats } from "../hooks/useDashboardStats";
import { motion } from "framer-motion";
import SideBar from "../components/ui/sidebar/SideBar";

const cardGridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

// Styled component for logout button
const LogoutButtonStyledWrapper = styled.div`
  .button {
    cursor: pointer;
    border: none;
    background: #3cacac;
    color: #fff;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    display: grid;
    place-content: center;
    transition: background 300ms, transform 200ms;
    font-weight: 600;
    margin: 0 auto;
  }

  .button__text {
    position: absolute;
    inset: 0;
    animation: text-rotation 8s linear infinite;

    > span {
      position: absolute;
      transform: rotate(calc(19deg * var(--index)));
      inset: 7px;
      font-size: 14px;
      color: #fff;
    }
  }

  .button__circle {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
    background: #fff;
    color: #84db7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button:hover {
    background: #000;
    transform: scale(1.1);
  }

  @keyframes text-rotation {
    to {
      rotate: 360deg;
    }
  }
`;

// Logout button component
const LogoutButtonStyled = () => {
  return (
    <LogoutButtonStyledWrapper>
      <button className="button">
        <p className="button__text">
          {Array.from("CERRAR SESIÓN").map((char, index) => (
            <span key={index} style={{ "--index": index } as React.CSSProperties}>
              {char}
            </span>
          ))}
        </p>
        <div className="button__circle">
          <LogoutButton />
        </div>
      </button>
    </LogoutButtonStyledWrapper>
  );
};

const sidebarItems = [
  { icon: homeIcon,   label: "Inicio",   path: "/newhome" },
  { icon: moduleIcon, label: "Granjas",  path: "/farm" },
  { icon: userIcon,   label: "Usuarios", path: "/users" },
  { icon: fishIcon,   label: "Módulos",  path: "/module" },
  { icon: reportIcon, label: "Reporte",  path: "/report" },
];

//  Main component of NewHome page
const NewHome: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [animateSidebar, setAnimateSidebar] = useState(false);
  const [userName, setUserName] = useState<string>("Usuario");
  const [darkMode, setDarkMode] = useState(false);
  const { stats } = useDashboardStats();
  const { metrics } = useDashboardMetrics();
  const { totalNotifications } = useNotificationStats();
  const menuRef = useRef<HTMLDivElement>(null);
  const slides = [
    { title: "Acuaterra Modulo", button: "1", src: foto1 },
    { title: "Modulo Acuaponico", button: "2", src: foto2 },
    { title: "Acuaterra Granja", button: "3", src: foto3 },
  ];

  // we verify the token validity and set the username
  useEffect(() => {
    if (!isTokenValid()) {
      console.log("Redirecting to /auth from NewHome component");
      void navigate({ to: "/auth" });
    } else {
      const name = localStorage.getItem("userName");
      console.log("User name retrieved from localStorage:", name);
      setUserName(name || "Usuario");
    }
  }, [navigate]);

  // we control screen size for mobile view
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      if (!isMobileView) {
        setAnimateSidebar(true);
        setTimeout(() => {
          setAnimateSidebar(false);
        }, 500);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  const SkeletonCard = () => (
  <div className="rounded-xl p-6 shadow-lg w-full h-64 bg-gray-300 animate-pulse" />
);

  // we retrieve the dark mode state from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.body.classList.toggle("dark-mode", savedDarkMode);
  }, []);

  // alternate dark mode and save state in localStorage
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.body.classList.toggle("dark-mode", newDarkMode);
  };

  // close the sidebar when navigating to /newhome
  useEffect(() => {
    if (location.pathname === "/newhome") {
      setIsOpen(false);
    }
  }, [location.pathname]);

  //  we use the navigate function
  const handleNavigation = (path: string) => {
    void navigate({ to: path });
    setIsOpen(false);
  };

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/*  toogle button for mobile sidebar   */}
      <HamburgerMenuButton
       darkMode={darkMode}
       isOpen={isOpen}
       onClick={() => { setIsOpen(!isOpen); }}
     />

      {/* Sidebar */}
       <SideBar
          LogoutButtonStyled ={<LogoutButtonStyled />}
          acuaterraLogo      ={acuaterraLogo}
          animateSidebar     ={animateSidebar}
          darkMode           ={darkMode}
          handleNavigation   ={handleNavigation}
          isMobile           ={isMobile}
          isOpen             ={isOpen}
          items              ={sidebarItems}
          location           ={{ pathname: location.pathname }}
          menuRef            ={menuRef}
          setIsOpen          ={setIsOpen}
          toggleDarkMode     ={toggleDarkMode}
          userName           ={userName}
        />

      {/* Main Content */}
      <main
        className={`flex-1 p-6 lg:ml-64 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
        }`}
      >
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-5 text-center">
          Acuaterra
        </h1>
        <p className="mb-7 text-base sm:text-sm text-center">
          Acuaterra es una herramienta de software diseñada para sistematizar el
          proceso de monitoreo en módulos acuapónicos.
        </p>

        {isMobile ? (
          <MobileCarousel />
        ) : (
          <>
            <Carousel slides={slides} />
          </>
        )}

        {/* dashboard section*/}

        
       {stats && metrics ? (
      <motion.div
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-40"
        initial="hidden"
        variants={cardGridVariants}
       >
          <motion.div variants={cardVariants}>
            <FarmsPieChart darkMode={darkMode}   farms={stats.farms} />
          </motion.div>

          <motion.div variants={cardVariants}>
            <ModulesPieChart darkMode={darkMode} modules={stats.modules} />
          </motion.div>

          <motion.div variants={cardVariants}>
            <TotalFarmsCard darkMode={darkMode}  total={metrics.totalFarms} />
          </motion.div>

          <motion.div variants={cardVariants}>
            <TotalModulesCard darkMode={darkMode} total={metrics.totalModules} />
          </motion.div>

          <motion.div variants={cardVariants}>
            <TotalUsersCard darkMode={darkMode}   total={metrics.totalUsers} />
          </motion.div>

          <motion.div variants={cardVariants}>
            <NotificationsAreaChart darkMode={darkMode} total={totalNotifications ?? 0} />
          </motion.div>
       </motion.div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-40">
              {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
          </div>
          )}
      </main>
    </div>
  );
};

export default NewHome;

