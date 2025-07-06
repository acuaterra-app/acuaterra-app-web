import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";
import { motion } from "framer-motion";
Chart.register(BarElement, CategoryScale, LinearScale);

interface TotalFarmsCardProps {
  total: number;
  darkMode: boolean;
}

const TotalFarmsCard: React.FC<TotalFarmsCardProps> = ({ total, darkMode }) => {
  const data = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Granjas",
        data: [2, 3, 4, 5, 6, 7, total],
        backgroundColor: darkMode ? "#10b981" : "#059669",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
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
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
          </svg>
        </div>
        <h3 className={`text-sm font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>
          GRANJAS TOTALES
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
          transition={{ delay: 0.5, type: "spring" }}
        >
          +2%
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
        Evolución semanal de granjas
      </p>
    </motion.div>
  );
};

export default TotalFarmsCard;