import { motion } from "framer-motion";

interface ModulesPieChartProps {
  modules: { labels: Array<string>; datasets: Array<{ data: Array<number> }> };
  darkMode: boolean;
}

const ModulesPieChart: React.FC<ModulesPieChartProps> = ({ modules, darkMode }) => {
  const activeModules = modules.datasets[0]?.data[0] ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: 0.15, type: "spring", stiffness: 300 }}
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
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path clipRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" fillRule="evenodd" />
          <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-1v-1z" />
        </svg>
      </div>
      
      <h3 className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
        Módulos Activos
      </h3>
      
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-5xl font-extrabold ${darkMode ? "text-green-400" : "text-green-600"}`}>
          {activeModules}
        </span>
        <span
          className="text-green-500 text-sm cursor-help font-semibold"
          title="Crecimiento respecto a la semana pasada"
        >
          ▲ 3%
        </span>
      </div>
      
      <p className={`text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Módulos operativos en el sistema
      </p>
    </motion.div>
  );
};

export default ModulesPieChart;