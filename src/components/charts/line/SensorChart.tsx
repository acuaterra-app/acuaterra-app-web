import type React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SensorChartProps {
  labels: Array<string>;
  data: Array<number>;
  color: string; // Nuevo prop para el color
}

const SensorChart: React.FC<SensorChartProps> = ({ labels, data, color }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Valores del Sensor",
        data,
        borderColor: color,
        backgroundColor: `${color}33`, // Color con transparencia
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Gráfico de Sensor (Tiempo vs Valores)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tiempo",
        },
      },
      y: {
        title: {
          display: true,
          text: "Valores",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default SensorChart;