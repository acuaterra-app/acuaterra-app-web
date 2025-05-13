import type React from "react";

interface DashboardMetricsProps {
  totalFarms: number;
  totalModules: number;
  totalUsers: number;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ totalFarms, totalModules, totalUsers }) => {
  const cardStyles = "p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Farms */}
      <div className={`${cardStyles}`} style={{ backgroundColor: "#57CC99", color: "#03045E" }}>
        <h3 className="text-xl font-bold mb-2">Granjas Totales</h3>
        <p className="text-2xl">{totalFarms}</p>
      </div>

      {/* Total Modules */}
      <div className={`${cardStyles}`} style={{ backgroundColor: "#80ED99", color: "#03045E" }}>
        <h3 className="text-xl font-bold mb-2">Módulos Totales</h3>
        <p className="text-2xl">{totalModules}</p>
      </div>

      {/* Total Users */}
      <div className={`${cardStyles}`} style={{ backgroundColor: "#C7F9CC", color: "#03045E" }}>
        <h3 className="text-xl font-bold mb-2">Usuarios Totales</h3>
        <p className="text-2xl">{totalUsers}</p>
      </div>
    </div>
  );
};

export default DashboardMetrics;