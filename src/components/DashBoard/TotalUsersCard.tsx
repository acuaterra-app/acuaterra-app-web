import { Line } from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { motion } from "framer-motion";
Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

interface TotalUsersCardProps {
  total: number;
  darkMode: boolean;
}

const TotalUsersCard: React.FC<TotalUsersCardProps> = ({ total, darkMode }) => {
  const data = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Usuarios",
        data: [10, 20, 30, 40, 50, 60, total],
        borderColor: darkMode ? "#10b981" : "#059669",
        backgroundColor: darkMode ? "rgba(16, 185, 129, 0.1)" : "rgba(5, 150, 105, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
      viewport={{ once: true, amount: 0.3 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      className={`rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between w-full h-64 transition-all duration-500 transform-gpu
        ${darkMode
          ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600"
          : "bg-gradient-to-br from-white via-green-50 to-green-100 border border-green-200"}
        backdrop-blur-xl bg-opacity-90
      `}
      whileHover={{ 
        scale: 1.03, 
        y: -8,
        boxShadow: darkMode 
          ? "0 25px 50px -12px rgba(16, 185, 129, 0.3)" 
          : "0 25px 50px -12px rgba(5, 150, 105, 0.2)"
      }}
    >
      <div className="flex items-center justify-between w-full mb-4">
        <div className={`p-3 rounded-full ${darkMode ? "bg-green-600" : "bg-green-500"}`}>
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <h3 className={`text-sm font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>
          USUARIOS TOTALES
        </h3>
      </div>
      
      <div className="flex items-end justify-center w-full mb-4">
        <span className={`text-5xl font-black ${darkMode ? "text-white" : "text-gray-800"}`}>
          {total}
        </span>
        <motion.span
          animate={{ scale: 1 }}
          className="ml-2 mb-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full"
          initial={{ scale: 0 }}
          title="Crecimiento mensual"
          transition={{ delay: 0.7, type: "spring" }}
        >
          +7%
        </motion.span>
      </div>
      
      <div className="w-full h-16 mb-2">
        <Line data={data} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { display: false },
            tooltip: { enabled: false }
          },
          scales: { 
            x: { display: false, grid: { display: false } }, 
            y: { display: false, grid: { display: false } }
          },
          elements: {
            point: {
              radius: 0,
              hoverRadius: 0,
            }
          }
        }} />
      </div>
      
      <p className={`text-xs text-center font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Crecimiento mensual de usuarios
      </p>
    </motion.div>
  );
};

export default TotalUsersCard;