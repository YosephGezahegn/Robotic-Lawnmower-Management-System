import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { format, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BatteryChart: React.FC = () => {
  const batteryHistory = useSelector((state: RootState) => state.mower.batteryHistory);

  const data = {
    labels: batteryHistory.map(entry => format(parseISO(entry.timestamp), 'HH:mm')),
    datasets: [
      {
        label: 'Battery Level',
        data: batteryHistory.map(entry => entry.level),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Battery Level History',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Line options={options} data={data} />
    </div>
  );
}

export default BatteryChart;