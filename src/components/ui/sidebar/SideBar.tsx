import { useState, useEffect } from "react";
import { X, Sun, Moon } from "lucide-react";
import styled from "styled-components";

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
      transform 0.3s cubic-bezier(.4,0,.2,1),
      opacity 0.35s cubic-bezier(.4,0,.2,1),
      visibility 0.35s cubic-bezier(.4,0,.2,1);
    opacity: ${({ expanded }: { expanded: boolean }): number => (expanded ? 1 : 0)};
    visibility: ${({ expanded }: { expanded: boolean }): string => (expanded ? "visible" : "hidden")};
  }
  .logo:hover {
    transform: scale(1.1);
  }
`;

const WelcomeText = styled.p<{ darkMode: boolean; expanded: boolean }>`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${(props): string => (props.darkMode ? "white" : "#4a4a4a")};
  margin-top: 0.5rem;
  text-align: center;
  transition: 
    transform 0.3s cubic-bezier(.4,0,.2,1),
    color 0.3s cubic-bezier(.4,0,.2,1),
    opacity 0.35s cubic-bezier(.4,0,.2,1),
    visibility 0.35s cubic-bezier(.4,0,.2,1);
  opacity: ${({ expanded }: { expanded: boolean }): number => (expanded ? 1 : 0)};
  visibility: ${({ expanded }): string => (expanded ? "visible" : "hidden")};
  &:hover {
    transform: scale(1.1);
  }
`;

const LogoutButtonStyledWrapper = styled.div<{ expanded: boolean }>`
  margin-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
  transition: 
    opacity 0.35s cubic-bezier(.4,0,.2,1),
    visibility 0.35s cubic-bezier(.4,0,.2,1);
  opacity: ${({ expanded }: { expanded: boolean }): number => (expanded ? 1 : 0)};
  visibility: ${({ expanded }: { expanded: boolean }): string => (expanded ? "visible" : "hidden")};
`;

const ScrollableNav = styled.nav<{ darkMode: boolean }>`
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
    background: ${({ darkMode }: { darkMode: boolean }): string => (darkMode ? "#23272f" : "#e0e0e0")};
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ darkMode }: { darkMode: boolean }): string => (darkMode ? "#444950" : "#bdbdbd")};
    border-radius: 4px;
  }
  scrollbar-width: thin;
  scrollbar-color: ${({ darkMode }: { darkMode: boolean }): string =>
    darkMode ? "#444950 #23272f" : "#bdbdbd #e0e0e0"};
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
        ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-[#e0e0e0] text-gray-600 border-gray-400"}
        border-r flex flex-col transform transition-all duration-500 ease-in-out z-50 shadow-lg
        ${isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"}
        ${animateSidebar ? "animate-slide-in" : ""}
      `}
      style={{
        width: expanded ? "16rem" : "4.5rem",
        height: "100vh",
        boxShadow: "5px 0 15px rgba(0, 0, 0, 0.2)",
        transition: "width 0.5s cubic-bezier(.4,0,.2,1), box-shadow 0.3s cubic-bezier(.4,0,.2,1)",
        backgroundClip: "padding-box",
      }}
      onMouseEnter={() => { if (!isMobile) setIsHovered(true); }}
      onMouseLeave={() => { if (!isMobile) setIsHovered(false); }}
    >
      <div className="p-4 flex flex-col items-center relative">
        {/* Close sidebar button for mobile */}
        <button
          aria-label="Cerrar menú lateral"
          className={`absolute top-2 right-2 p-2 lg:hidden transition-colors ${
            darkMode
              ? "text-gray-300 hover:text-white"
              : "text-gray-400 hover:text-gray-600"
          }`}
          onClick={() => { setIsOpen(false); }}
        >
          <X size={24} />
        </button>

        
        <SidebarLogoWrapper expanded={expanded}>
          <img alt="Acuaterra Logo" className="logo mb-2" src={acuaterraLogo} />
        </SidebarLogoWrapper>

       
        <WelcomeText darkMode={darkMode} expanded={expanded}>
          Bienvenido, {userName}!
        </WelcomeText>

       
        <button
          className={`mt-4 p-2 rounded shadow-md flex items-center justify-center transition-colors ${
            darkMode
              ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
          style={{
            transition: "background 0.3s cubic-bezier(.4,0,.2,1), color 0.3s cubic-bezier(.4,0,.2,1)",
          }}
          onClick={toggleDarkMode}
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      {/* Navigation section */}
      <ScrollableNav darkMode={darkMode}>
        <ul className="space-y-3 md:space-y-20 mt-4 md:mt-5">
          {items.map((item, index) => (
            <li
              key={index}
              className={`relative group flex items-center ${expanded ? "justify-center gap-3 p-2" : "justify-center p-2"} cursor-pointer overflow-hidden rounded-lg ${
                location.pathname === item.path
                  ? "bg-[#3cacac] text-white shadow-md"
                  : darkMode
                  ? "text-white group-hover:text-white"
                  : "text-gray-600 group-hover:text-black"
              }`}
              style={{
                transition: "background 0.35s cubic-bezier(.4,0,.2,1), color 0.35s cubic-bezier(.4,0,.2,1)",
              }}
              onClick={() => { handleNavigation(item.path); }}
            >
              <span
                className={`absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-lg ${
                  location.pathname === item.path
                    ? "bg-[#3cacac]"
                    : "bg-[#3cacac]"
                }`}
              ></span>
              <span className="relative z-10 flex items-center gap-3 font-bold">
                <img
                  alt={item.label}
                  className="h-6 w-6"
                  src={item.icon}
                  style={
                    darkMode
                      ? { filter: "invert(1) brightness(1.5) contrast(1.2)" }
                      : {}
                  }
                />
             
                {expanded && item.label}
              </span>
            </li>
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