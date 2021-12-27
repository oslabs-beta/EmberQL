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
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,

);
import { Line } from 'react-chartjs-2';

interface GraphContainerProps {
  timesArray: number[];
}

function GraphContainer( { timesArray } : GraphContainerProps) {
  const data = {
    labels: timesArray.map((el, i) => `Query ${i + 1}`),
    datasets: [
      {
        label: 'Query',
        data: timesArray,
        borderColor: '#FF4C29',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  // use ChartOptions to change the default font size to 20
  const options : any = {
    legend: {
      labels: {
        font: {
          size: 24,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 24,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 24,
          },
        },
      },
    },
  };

  return (
    <div className="graph-container">
      <Line data={data} options={options}/>
    </div>
  );
}

export default GraphContainer;
