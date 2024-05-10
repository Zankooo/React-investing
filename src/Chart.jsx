import { formatDecimal } from './util';
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
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
              label += ': ';
          }
          if (context.parsed.y !== null) {
              label += formatDecimal(context.parsed.y);
          }
          return label;
        }
      }
    }
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
            return formatDecimal(value, 0);
        },
      },
      stacked: true,
    },
  },
};


function Chart({chartDataNavadno, chartDataSkladi}) {

  const labels = Array.from(chartDataNavadno.keys());
  for (let i = 0; i < labels.length; i++) {
    labels[i] = labels[i] + 1;
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Pasivni ETF',
        data: chartDataNavadno,
        backgroundColor: '#3D8AFF',
        stack: 'Stack 0',
      },
      {
        label: 'Vzajemni skladi',
        data: chartDataSkladi,
        backgroundColor: '#FF9A3D',
        stack: 'Stack 1',
      },
    ],
  };

  return (
    <>
      <div className="chart-container">
        <Bar options={options} data={data} />
      </div>
    </>
  )
}

export default Chart