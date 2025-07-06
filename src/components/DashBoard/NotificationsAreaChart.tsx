import { Line } from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { motion } from "framer-motion";
Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

interface NotificationsAreaChartProps {
  total: number;
  darkMode: boolean;
}

const NotificationsAreaChart: React.FC<NotificationsAreaChartProps> = ({ total, darkMode }) => {
  const data = {
    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
    datasets: [
      {
        label: "Notificaciones",
        data: [10, 20, 15, total],
        fill: true,
        backgroundColor: darkMode ? "rgba(16, 185, 129, 0.1)" : "rgba(5, 150, 105, 0.1)",
        borderColor: darkMode ? "#10b981" : "#059669",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      transition={{ duration: 0.8, delay: 0.35, type: "spring", stiffness: 200, damping: 20 }}
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
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </div>
        <h3 className={`text-sm font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>
          NOTIFICACIONES
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
          title="Notificaciones respecto al mes pasado"
          transition={{ delay: 0.8, type: "spring" }}
        >
          +6%
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
        Actividad semanal
      </p>
    </motion.div>
  );
};

export default NotificationsAreaChart;