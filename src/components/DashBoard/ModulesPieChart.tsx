import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
Chart.register(ArcElement, Tooltip, Legend);

interface ModulesPieChartProps {
  modules: { labels: Array<string>; datasets: Array<{ data: Array<number> }> };
  darkMode: boolean;
}

const ModulesPieChart: React.FC<ModulesPieChartProps> = ({ modules, darkMode }) => {
  const data = {
    labels: ["Activos", "Inactivos"],
    datasets: [
      {
        data: modules.datasets[0]?.data ?? [0, 0],
        backgroundColor: ["#57CC99", "#22577A"],
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
        ${darkMode ? "bg-gray-800" : "bg-gray-200"}
      `}
    >
      <h3 className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Estado de Módulos</h3>
      <div className="w-32 h-32 sm:w-40 sm:h-40">
        <Pie data={data} />
      </div>
      <p className={`mt-2 text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Distribución de módulos activos e inactivos.
      </p>
    </motion.div>
  );
};

export default ModulesPieChart;