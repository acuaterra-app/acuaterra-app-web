import { useState, useEffect } from "react";
import { X, Sun, Moon } from "lucide-react";
import styled from "styled-components";
import { motion } from "framer-motion";

interface SidebarItem {
  icon: string;
  label: string;
  path: string;
}

interface SideBarProps {
  darkMode: boolean;
  menuRef?: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
  animateSidebar?: boolean;
  userName: string;
  items: Array<SidebarItem>;
  location: { pathname: string };
  handleNavigation: (path: string) => void;
  acuaterraLogo: string;
  toggleDarkMode: () => void;
  LogoutButtonStyled: React.ReactNode;
  onSidebarExpandChange?: (expanded: boolean) => void; // <--- NUEVO
}

const SidebarLogoWrapper = styled.div<{ expanded: boolean }>`
  .logo {
    width: 80px;
    height: 80px;
    transition: 
      transform 0.4s cubic-bezier(.4,0,.2,1),
      opacity 0.4s cubic-bezier(.4,0,.2,1),
      visibility 0.4s cubic-bezier(.4,0,.2,1),
      filter 0.3s ease;
    opacity: ${({ expanded }: { expanded: boolean }): number => (expanded ? 1 : 0)};
    visibility: ${({ expanded }: { expanded: boolean }): string => (expanded ? "visible" : "hidden")};
    border-radius: 20px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
  }
  .logo:hover {
    transform: scale(1.08) rotate(2deg);
    filter: brightness(1.1) drop-shadow(0 10px 20px rgba(60, 172, 172, 0.3));
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }
`;

const WelcomeText = styled.p<{ darkMode: boolean; expanded: boolean }>`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${(props): string => (props.darkMode ? "#ffffff" : "#2d3748")};
  margin-top: 0.5rem;
  text-align: center;
  background: ${(props): string => 
    props.darkMode 
      ? "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)"
      : "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)"
  };
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: 
    transform 0.4s cubic-bezier(.4,0,.2,1),
    background 0.3s cubic-bezier(.4,0,.2,1),
    opacity 0.4s cubic-bezier(.4,0,.2,1),
    visibility 0.4s cubic-bezier(.4,0,.2,1),
    text-shadow 0.3s ease;
  opacity: ${({ expanded }: { expanded: boolean }): number => (expanded ? 1 : 0)};
  visibility: ${({ expanded }): string => (expanded ? "visible" : "hidden")};
  text-shadow: ${(props): string => 
    props.darkMode 
      ? "0 2px 10px rgba(255, 255, 255, 0.1)"
      : "0 2px 10px rgba(45, 55, 72, 0.1)"
  };
  &:hover {
    transform: scale(1.05);
    text-shadow: ${(props): string => 
      props.darkMode 
        ? "0 4px 15px rgba(255, 255, 255, 0.2)"
        : "0 4px 15px rgba(45, 55, 72, 0.2)"
    };
  }
`;

const LogoutButtonStyledWrapper = styled.div<{ expanded: boolean }>`
  margin-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
  transition: 
    opacity 0.4s cubic-bezier(.4,0,.2,1),
    visibility 0.4s cubic-bezier(.4,0,.2,1),
    transform 0.3s cubic-bezier(.4,0,.2,1);
  opacity: ${({ expanded }: { expanded: boolean }): number => (expanded ? 1 : 0)};
  visibility: ${({ expanded }: { expanded: boolean }): string => (expanded ? "visible" : "hidden")};
  filter: drop-shadow(0 8px 16px rgba(60, 172, 172, 0.2));
  
  &:hover {
    transform: translateY(-2px);
    filter: drop-shadow(0 12px 24px rgba(60, 172, 172, 0.3));
  }
`;

const ScrollableNav = styled.nav<{ darkMode: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
  
  /* Scrollbar moderno y elegante */
  &::-webkit-scrollbar {
    width: 6px;
    background: ${({ darkMode }: { darkMode: boolean }): string => 
      darkMode ? "rgba(35, 39, 47, 0.3)" : "rgba(224, 224, 224, 0.3)"};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ darkMode }: { darkMode: boolean }): string => 
      darkMode 
        ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
        : "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)"};
    border-radius: 3px;
    transition: background 0.3s ease;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ darkMode }: { darkMode: boolean }): string => 
      darkMode 
        ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
        : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"};
  }
  scrollbar-width: thin;
  scrollbar-color: ${({ darkMode }: { darkMode: boolean }): string =>
    darkMode 
      ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%) rgba(35, 39, 47, 0.3)"
      : "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%) rgba(224, 224, 224, 0.3)"};
`;

const SideBar: React.FC<SideBarProps> = ({
  darkMode,
  menuRef,
  isOpen,
  setIsOpen,
  isMobile,
  animateSidebar,
  userName,
  items,
  location,
  handleNavigation,
  acuaterraLogo,
  toggleDarkMode,
  LogoutButtonStyled,
  onSidebarExpandChange, 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const expanded = isMobile || isOpen || isHovered;

  
  useEffect(() => {
    if (onSidebarExpandChange) {
      onSidebarExpandChange(expanded);
    }
  }, [expanded, onSidebarExpandChange]);

  return (
    <aside
      ref={menuRef}
      className={`fixed top-0 left-0 h-screen
        ${darkMode 
          ? "bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 text-white border-gray-600" 
          : "bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-600 border-gray-300"}
        border-r flex flex-col transform transition-all duration-500 ease-in-out z-50
        ${isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"}
        ${animateSidebar ? "animate-slide-in" : ""}
        backdrop-blur-xl bg-opacity-95
      `}
      style={{
        width: expanded ? "16rem" : "4.5rem",
        height: "100vh",
        boxShadow: darkMode 
          ? "5px 0 25px rgba(0, 0, 0, 0.4), inset -1px 0 0 rgba(255, 255, 255, 0.1)"
          : "5px 0 25px rgba(0, 0, 0, 0.15), inset -1px 0 0 rgba(0, 0, 0, 0.05)",
        transition: "width 0.5s cubic-bezier(.4,0,.2,1), box-shadow 0.3s cubic-bezier(.4,0,.2,1), background 0.4s ease",
        backgroundClip: "padding-box",
        borderImage: darkMode
          ? "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%) 1"
          : "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%) 1",
        willChange: "width, transform",
        transform: `translateX(${isOpen || !isMobile ? "0" : "-100%"}) translateZ(0)`,
      }}
      onMouseEnter={() => { if (!isMobile) setIsHovered(true); }}
      onMouseLeave={() => { if (!isMobile) setIsHovered(false); }}
    >
      <div className="p-4 flex flex-col items-center relative">
        {/* Close sidebar button for mobile */}
        <button
          aria-label="Cerrar menú lateral"
          className={`absolute top-2 right-2 p-2 lg:hidden transition-all duration-300 rounded-full
            ${darkMode
              ? "text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-200 active:bg-gray-300"}
            transform hover:scale-110 active:scale-95 hover:rotate-90
          `}
          style={{
            backdropFilter: "blur(10px)",
            boxShadow: darkMode 
              ? "0 4px 12px rgba(0, 0, 0, 0.3)"
              : "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
          onClick={() => { setIsOpen(false); }}
        >
          <X size={20} />
        </button>

        
        <SidebarLogoWrapper expanded={expanded}>
          <img alt="Acuaterra Logo" className="logo mb-2" src={acuaterraLogo} />
        </SidebarLogoWrapper>

       
        <WelcomeText darkMode={darkMode} expanded={expanded}>
          Bienvenido, {userName}!
        </WelcomeText>

        {/* Dark mode toggle button */}
        <button
          className={`mt-4 p-3 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 transform
            ${darkMode
              ? "bg-gradient-to-r from-gray-700 to-gray-600 text-yellow-300 hover:from-gray-600 hover:to-gray-500 hover:text-yellow-200"
              : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400 hover:text-gray-800"}
            hover:scale-110 active:scale-95 hover:rotate-12 group
          `}
          style={{
            backdropFilter: "blur(15px)",
            boxShadow: darkMode
              ? "0 8px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              : "0 8px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
            transition: "all 0.4s cubic-bezier(.4,0,.2,1)",
          }}
          onClick={toggleDarkMode}
        >
          <span className="transform transition-transform duration-300 group-hover:rotate-180">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </span>
        </button>
      </div>

      {/* Navigation section */}
      <ScrollableNav darkMode={darkMode}>
        <ul className="space-y-3 md:space-y-20 mt-4 md:mt-5">
          {items.map((item, index) => (
            <motion.li
              key={index}
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              className={`relative group flex items-center ${expanded ? "justify-center gap-3 p-3" : "justify-center p-3"} cursor-pointer overflow-hidden rounded-xl mx-2
                ${location.pathname === item.path
                  ? "bg-gradient-to-r from-[#3cacac] to-[#2c9d9d] text-white shadow-lg transform scale-105"
                  : darkMode
                  ? "text-white hover:text-white"
                  : "text-gray-600 hover:text-black"}
                transition-all duration-400 ease-in-out transform hover:scale-105 active:scale-95
              `}
              style={{
                backdropFilter: "blur(10px)",
                boxShadow: location.pathname === item.path
                  ? "0 8px 25px rgba(60, 172, 172, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                  : "0 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.4s cubic-bezier(.4,0,.2,1)",
                willChange: "transform, box-shadow",
              }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
              onClick={() => { handleNavigation(item.path); }}
            >
              <span
                className={`absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-xl
                  ${location.pathname === item.path
                    ? "bg-gradient-to-r from-[#3cacac] to-[#2c9d9d]"
                    : "bg-gradient-to-r from-[#3cacac] to-[#2c9d9d]"}
                  opacity-90
                `}
                style={{
                  background: location.pathname === item.path
                    ? "linear-gradient(135deg, #3cacac 0%, #2c9d9d 100%)"
                    : "linear-gradient(135deg, #3cacac 0%, #2c9d9d 100%)",
                }}
              ></span>
              <span className="relative z-10 flex items-center gap-3 font-bold transition-all duration-300">
                <img
                  alt={item.label}
                  className="h-6 w-6 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6"
                  src={item.icon}
                  style={{
                    filter: darkMode
                      ? "invert(1) brightness(1.2) contrast(1.1) drop-shadow(0 2px 4px rgba(255, 255, 255, 0.1))"
                      : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                    transition: "filter 0.3s ease, transform 0.3s ease",
                  }}
                />
                {/* Label con animación de fade */}
                <span 
                  className={`transition-all duration-300 ${expanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                  style={{
                    textShadow: darkMode 
                      ? "0 1px 3px rgba(0, 0, 0, 0.3)"
                      : "0 1px 3px rgba(255, 255, 255, 0.8)",
                  }}
                >
                  {expanded && item.label}
                </span>
              </span>
            </motion.li>
          ))}
        </ul>
        
        <LogoutButtonStyledWrapper expanded={expanded}>
          {LogoutButtonStyled}
        </LogoutButtonStyledWrapper>
      </ScrollableNav>
    </aside>
  );
};

export default SideBar;