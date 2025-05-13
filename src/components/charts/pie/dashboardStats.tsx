import React from "react";

interface DashboardStatsProps {
  farms: { labels: string[]; datasets: { data: number[] }[] };
  modules: { labels: string[]; datasets: { data: number[] }[] };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ farms, modules }) => {
  const cardStyles = "p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Farms Card */}
      <div className={`${cardStyles} bg-green-500 text-white`}>
        <h3 className="text-xl font-bold mb-2">Granjas</h3>
        <p>Activas: {farms.datasets?.[0]?.data?.[0] ?? 0}</p>
        <p>Inactivas: {farms.datasets?.[0]?.data?.[1] ?? 0}</p>
      </div>

      {/* Modules Card */}
      <div className={`${cardStyles} bg-blue-500 text-white`}>
        <h3 className="text-xl font-bold mb-2">Módulos</h3>
        <p>Activos: {modules.datasets?.[0]?.data?.[0] ?? 0}</p>
        <p>Inactivos: {modules.datasets?.[0]?.data?.[1] ?? 0}</p>
      </div>
    </div>
  );
};

export default DashboardStats;