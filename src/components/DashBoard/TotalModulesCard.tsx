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
        backgroundColor: "#57CC99",
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 300 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-6 shadow-lg flex flex-col items-center w-full transition-colors duration-300
        ${darkMode ? "bg-gray-800" : "bg-gray-200"}
      `}
    >
      <h3 className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Módulos Totales</h3>
      <span className="text-4xl font-extrabold text-gray-400">{total}</span>
      <div className="w-full h-20">
        <Bar data={data} options={{
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } }
        }} />
      </div>
      <p className={`mt-2 text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Evolución semanal de módulos registrados.
      </p>
    </motion.div>
  );
};

export default TotalModulesCard;