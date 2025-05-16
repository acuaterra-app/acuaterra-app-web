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
        borderColor: "#80ED99",
        backgroundColor: "rgba(128,237,153,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 300 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-6 shadow-lg flex flex-col items-center w-full transition-colors duration-300
        ${darkMode ? "bg-gray-800" : "bg-gray-200"}
      `}
    >
      <h3 className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Usuarios Totales</h3>
      <span className="text-4xl font-extrabold text-gray-400">{total}</span>
      <div className="w-full h-20">
        <Line data={data} options={{
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } }
        }} />
      </div>
      <p className={`mt-2 text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Crecimiento mensual de usuarios.
      </p>
    </motion.div>
  );
};

export default TotalUsersCard;