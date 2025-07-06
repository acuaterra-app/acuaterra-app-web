/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type FC, useEffect, useState, useRef } from "react";
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
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.8,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.6,
    }
  },
};

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

const LogoutButtonStyled = () => (
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

const sidebarItems = [
  { icon: homeIcon,   label: "Inicio",   path: "/newhome" },
  { icon: moduleIcon, label: "Granjas",  path: "/farm"    },
  { icon: userIcon,   label: "Usuarios", path: "/users"   },
  { icon: fishIcon,   label: "Módulos",  path: "/module"  },
  { icon: reportIcon, label: "Reporte",  path: "/report"  },
];

const NewHome: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [animateSidebar, setAnimateSidebar] = useState(false);
  const [userName, setUserName] = useState<string>("Usuario");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true); 
  const { stats } = useDashboardStats();
  const { metrics } = useDashboardMetrics();
  const { totalNotifications } = useNotificationStats();
  const menuRef = useRef<HTMLDivElement>(null);
  const slides = [
    { title: "Acuaterra Modulo", button:  "1", src: foto1 },
    { title: "Modulo Acuaponico", button: "2", src: foto2 },
    { title: "Acuaterra Granja", button:  "3", src: foto3 },
  ];

  useEffect(() => {
    if (!isTokenValid()) {
      void navigate({ to: "/auth" });
    } else {
      const name = localStorage.getItem("userName");
      setUserName(name || "Usuario");
    }
  }, [navigate]);

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
    <div className="rounded-2xl p-4 sm:p-6 shadow-lg w-full h-48 sm:h-56 lg:h-64 bg-gray-300 animate-pulse" />
  );

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.body.classList.toggle("dark-mode", savedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.body.classList.toggle("dark-mode", newDarkMode);
  };

  useEffect(() => {
    if (location.pathname === "/newhome") {
      setIsOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isOpen]);

  const handleNavigation = (path: string) => {
    void navigate({ to: path });
    setIsOpen(false);
  };

  const sidebarWidth = isMobile ? undefined : (sidebarExpanded ? "16rem" : "4.5rem");

  return (
    <div
      className={`relative min-h-screen bg-gray-100 ${
        darkMode ? "bg-gray-900 text-white" : "text-black"
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
        LogoutButtonStyled   ={<LogoutButtonStyled />}
        acuaterraLogo        ={acuaterraLogo}
        animateSidebar       ={animateSidebar}
        darkMode             ={darkMode}
        handleNavigation     ={handleNavigation}
        isMobile             ={isMobile}
        isOpen               ={isOpen}
        items                ={sidebarItems}
        location             ={{ pathname: location.pathname }}
        menuRef              ={menuRef}
        setIsOpen            ={setIsOpen}
        toggleDarkMode       ={toggleDarkMode}
        userName             ={userName}
        onSidebarExpandChange={setSidebarExpanded} 
      />

      {/* Main Content */}
      <motion.main
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`
          transition-all duration-500 ease-in-out
          ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"}
          ${isMobile ? "pt-20" : ""}
          min-h-screen
          overflow-y-auto
          relative
        `}
        style={{
          filter: isMobile && isOpen ? "blur(2px)" : "none",
          pointerEvents: isMobile && isOpen ? "none" : "auto",
          marginLeft: isMobile ? undefined : sidebarWidth, 
          background: darkMode 
            ? "linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)" 
            : "linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #ffffff 100%)",     
          transition: "margin-left 0.5s cubic-bezier(.4,0,.2,1), background 0.5s cubic-bezier(.4,0,.2,1), filter 0.3s ease",
        }}
      >
        <motion.h1 
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-5 text-center px-4"
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          Acuaterra
        </motion.h1>
        <motion.p 
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-7 text-sm sm:text-base md:text-lg text-center px-4 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.4,
            ease: "easeOut"
          }}
        >
          Acuaterra es una herramienta de software diseñada para sistematizar el
          proceso de monitoreo en módulos acuapónicos.
        </motion.p>

        {isMobile ? (
          <MobileCarousel />
        ) : (
          <Carousel slides={slides} />
        )}

        {/* dashboard section*/}
        {stats && metrics ? (
          <motion.div
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-20 sm:mt-30 lg:mt-40 px-4"
            initial="hidden"
            variants={cardGridVariants}
          >
            <motion.div variants={cardVariants}>
              <FarmsPieChart darkMode={darkMode}          farms={stats.farms} />
            </motion.div>
            <motion.div variants={cardVariants}>
              <ModulesPieChart darkMode={darkMode}        modules={stats.modules} />
            </motion.div>
            <motion.div variants={cardVariants}>
              <TotalFarmsCard darkMode={darkMode}         total={metrics.totalFarms} />
            </motion.div>
            <motion.div variants={cardVariants}>
              <TotalModulesCard darkMode={darkMode}       total={metrics.totalModules} />
            </motion.div>
            <motion.div variants={cardVariants}>
              <TotalUsersCard darkMode={darkMode}         total={metrics.totalUsers} />
            </motion.div>
            <motion.div variants={cardVariants}>
              <NotificationsAreaChart darkMode={darkMode} total={totalNotifications ?? 0} />
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-20 sm:mt-30 lg:mt-40 px-4">
            {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        )}
      </motion.main>
    </div>
  );
};

export default NewHome;