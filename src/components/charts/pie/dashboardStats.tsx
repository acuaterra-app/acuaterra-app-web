import type React from "react";
import styled from "styled-components";

interface DashboardStatsProps {
  farms: { labels: Array<string>; datasets: Array<{ data: Array<number> }> };
  modules: { labels: Array<string>; datasets: Array<{ data: Array<number> }> };
}

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  .card {
    width: 700px;
    height: 200px;
    perspective: 1000px;
    margin: 0 auto;
  }

  .card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.999s;
  }

  .card:hover .card-inner {
    transform: rotateY(180deg);
  }

  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border-radius: 10px;
    color: #fff;
    font-family: 'YourFontName', sans-serif; /* Reemplaza 'YourFontName' con la fuente utilizada en el título "Acuaterra" */
    font-weight: bold; /* Aplica el estilo en negrita */
  }

  .card-front {
    background-color: #22577A;
    border: 10px solid #22577A;
    transform: rotateY(0deg);
  }

  .card-back {
    background-color: #38A3A5;
    border: 10px solid #38A3A5;
    transform: rotateY(180deg);
  }
`;

const DashboardStats: React.FC<DashboardStatsProps> = ({ farms, modules }) => {
  return (
    <StyledWrapper>
      {/* Farms Card */}
      <div className="card">
        <div className="card-inner">
          <div className="card-front">
            <p>Granjas</p>
          </div>
          <div className="card-back">
            <p>
              Activas: {farms.datasets?.[0]?.data?.[0] ?? 0} <br />
              Inactivas: {farms.datasets?.[0]?.data?.[1] ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Modules Card */}
      <div className="card">
        <div className="card-inner">
          <div className="card-front">
            <p>Módulos</p>
          </div>
          <div className="card-back">
            <p>
              Activos: {modules.datasets?.[0]?.data?.[0] ?? 0} <br />
              Inactivos: {modules.datasets?.[0]?.data?.[1] ?? 0}
            </p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default DashboardStats;