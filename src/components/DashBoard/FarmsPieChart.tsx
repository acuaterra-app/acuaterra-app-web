import { motion } from "framer-motion";

interface FarmsPieChartProps {
  farms: { labels: Array<string>; datasets: Array<{ data: Array<number> }> };
  darkMode: boolean;
}

const FarmsPieChart: React.FC<FarmsPieChartProps> = ({ farms, darkMode }) => {
  const activeFarms = farms.datasets[0]?.data[0] ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 300 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-6 shadow-lg flex flex-col items-center justify-center w-full transition-colors duration-300
        ${darkMode
          ? "bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-80 backdrop-blur-md"
          : "bg-gradient-to-br from-green-50 to-green-100 bg-opacity-70 backdrop-blur-md"}
        hover:shadow-2xl hover:scale-105 transition-transform duration-300
      `}
    >
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
        darkMode ? "bg-green-600" : "bg-green-500"
      }`}>
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66c.67-2.33 2.48-6.18 5.91-8.1c3.66-1.95 6.97-2.31 8.24-2.23c-.12-5.66-1.35-7.36-2.86-11.67zm-1.22 12.09c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2zM5.4 8.8c0-1.1.9-2 2-2s2 .9 2 2s-.9 2-2 2s-2-.9-2-2zm8.6-5c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2z"/>
        </svg>
      </div>
      
      <h3 className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
        Granjas Activas
      </h3>
      
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-5xl font-extrabold ${darkMode ? "text-green-400" : "text-green-600"}`}>
          {activeFarms}
        </span>
        <span
          className="text-green-500 text-sm cursor-help font-semibold"
          title="Crecimiento respecto a la semana pasada"
        >
          ▲ 5%
        </span>
      </div>
      
      <p className={`text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Granjas operativas en el sistema
      </p>
    </motion.div>
  );
};

export default FarmsPieChart;