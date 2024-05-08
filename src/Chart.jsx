import './App.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: false,
      text: '',
    },
  },
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
      title: {
        display: true,
        text: 'Leto',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Skupna vrednost',
      },
      ticks: {
        // Include a dollar sign in the ticks
        callback: function(value, index, ticks) {
            return value + '€';
        },
      },
      stacked: true,
    },
  },
};


function Chart({chartDataNavadno, chartDataSkladi}) {

  const labels = Array.from(chartDataNavadno.keys().map(key => key+1));

  const data = {
    labels,
    datasets: [
      {
        label: 'Navadno investiranje',
        data: chartDataNavadno,
        backgroundColor: '#3D8AFF',
        stack: 'Stack 0',
      },
      {
        label: 'Skladi',
        data: chartDataSkladi,
        backgroundColor: '#FF9A3D',
        stack: 'Stack 1',
      },
    ],
  };

  return (
    <div className="chart-container">
      <Bar options={options} data={data} />
    </div>
  )
}

export default Chart