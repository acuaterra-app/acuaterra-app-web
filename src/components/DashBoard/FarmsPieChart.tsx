import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
Chart.register(ArcElement, Tooltip, Legend);

interface FarmsPieChartProps {
  farms: { labels: Array<string>; datasets: Array<{ data: Array<number> }> };
  darkMode: boolean;
}

const FarmsPieChart: React.FC<FarmsPieChartProps> = ({ farms, darkMode }) => {
  const data = {
    labels: ["Activas", "Inactivas"],
    datasets: [
      {
        data: farms.datasets[0]?.data ?? [0, 0],
        backgroundColor: ["#38A3A5", "#22577A"],
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 300 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-6 shadow-lg flex flex-col items-center w-full transition-colors duration-300
        ${darkMode
          ? "bg-gray-800 bg-opacity-80 backdrop-blur-md"
          : "bg-gray-200 bg-opacity-70 backdrop-blur-md"}
        hover:shadow-2xl hover:scale-105 transition-transform duration-300
      `}
    >
      <h3 className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Estado de Granjas</h3>
      <div className="w-32 h-32 sm:w-40 sm:h-40">
        <Pie data={data} />
      </div>
      {/* Indicador de tendencia y tooltip */}
      <span className="flex items-center gap-1 mt-2">
        <span className={`text-4xl font-extrabold ${darkMode ? "text-white" : "text-gray-800"}`}>
          {farms.datasets[0]?.data[0] ?? 0}
        </span>
        <span
          className="text-green-400 text-sm cursor-help"
          title="Crecimiento respecto a la semana pasada"
        >
          ▲ 5%
        </span>
      </span>
      <p className={`mt-2 text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Distribución de granjas activas e inactivas.
      </p>
    </motion.div>
  );
};

export default FarmsPieChart;