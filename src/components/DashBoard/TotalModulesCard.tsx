import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";
import { motion } from "framer-motion";
Chart.register(BarElement, CategoryScale, LinearScale);

interface TotalModulesCardProps {
  total: number;
  darkMode: boolean;
}

const TotalModulesCard: React.FC<TotalModulesCardProps> = ({ total, darkMode }) => {
  const data = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Módulos",
        data: [1, 2, 3, 4, 5, 6, total],
        backgroundColor: darkMode ? "#10b981" : "#059669",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      transition={{ duration: 0.8, delay: 0.25, type: "spring", stiffness: 200, damping: 20 }}
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
            <path clipRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" fillRule="evenodd" />
            <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-1v-1z" />
          </svg>
        </div>
        <h3 className={`text-sm font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>
          MÓDULOS TOTALES
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
          title="Incremento respecto a la semana pasada"
          transition={{ delay: 0.6, type: "spring" }}
        >
          +4%
        </motion.span>
      </div>
      
      <div className="w-full h-16 mb-2">
        <Bar data={data} options={{
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
            bar: {
              borderRadius: 4,
            }
          }
        }} />
      </div>
      
      <p className={`text-xs text-center font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Evolución semanal de módulos
      </p>
    </motion.div>
  );
};

export default TotalModulesCard;