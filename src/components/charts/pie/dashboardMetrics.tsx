import type React from "react";
import styled from "styled-components";

interface DashboardMetricsProps {
  totalFarms: number;
  totalModules: number;
  totalUsers: number;
}

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* One object for default */
  gap: 2rem;
  padding: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* Two objects for tablets */
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr); /* Three objects for normal ps screen size */
  }

  .cards {
    perspective: 500px;
  }

  .card {
    width: 100%;  /* Full width */
    max-width: 600px; /* mas-width limit */
    height: 150px;
    background: #80ED99;
    border: 2px solid #80ED99;
    border-radius: 20px;
    position: relative;
    transform-style: preserve-3d;
    will-change: transform;
    transition: transform 0.5s;
    margin: 0 auto;
  }

  .card:hover {
    transform: translateZ(10px) rotateX(20deg) rotateY(20deg);
  }

  .card_title {
    color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.5s;
    font: 700 1.5rem monospace;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  }

  .card:hover .card_title {
    transform: translateZ(50px);
  }
`;

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ totalFarms, totalModules, totalUsers }) => {
  return (
    <StyledWrapper>
      {/* Total Farms */}
      <div className="cards">
        <figure className="card">
          <figcaption className="card_title">Granjas Totales: {totalFarms}</figcaption>
        </figure>
      </div>

      {/* Total Modules */}
      <div className="cards">
        <figure className="card">
          <figcaption className="card_title">Módulos Totales: {totalModules}</figcaption>
        </figure>
      </div>

      {/* Total Users */}
      <div className="cards">
        <figure className="card">
          <figcaption className="card_title">Usuarios Totales: {totalUsers}</figcaption>
        </figure>
      </div>
    </StyledWrapper>
  );
};

export default DashboardMetrics;