import type React from "react";
import styled from "styled-components";

interface NotificationStatsCardProps {
  totalNotifications: number;
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;

  .card {
    width: 100%;
    max-width: 700px; /* Controla el ancho máximo */
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
    width: 100%; /* Cambia aquí */
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border-radius: 10px;
    color: #fff;
    font-family: 'YourFontName', sans-serif;
    font-weight: bold;
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

const NotificationStatsCard: React.FC<NotificationStatsCardProps> = ({ totalNotifications }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="card-inner">
          <div className="card-front">
            <p>Notificaciones</p>
          </div>
          <div className="card-back">
            <p>
              Total: {totalNotifications}
            </p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default NotificationStatsCard;