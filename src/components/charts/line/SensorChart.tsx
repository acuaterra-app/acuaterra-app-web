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
  color: string; //  new prop for the color
}

const SensorChart: React.FC<SensorChartProps> = ({ labels, data, color }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Valores del Sensor",
        data,
        borderColor: color,
        backgroundColor: `${color}33`, // Color with transparency
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Límite Inferior de Temperatura (24°C)",
        data: Array(labels.length).fill(24),
        borderColor: "blue",
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        borderDash: [8, 4], // dashed line (optional)
      },
       {
        label: "Límite Superior de Temperatura (27°C)",
        data: Array(labels.length).fill(27),
        borderColor: "red",
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        borderDash: [8, 4], // dashed line (optional)
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
        text: "Gráfico de Sensor (Tiempo vs Temperatura)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tiempo en minutos",
        },
      },
      y: {
        title: {
          display: true,
          text: "Valores en centígrados",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default SensorChart;