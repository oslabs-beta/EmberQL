import React from 'react'
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
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { Line } from 'react-chartjs-2'

interface GraphContainerProps {
  timesArray: number[];
}

function GraphContainer( { timesArray } : GraphContainerProps) {
const data = {
  labels: timesArray.map((el, i) => `Query ${i + 1}`),
  datasets: [
      {
        label: 'Dataset 1',
        data: timesArray,
        borderColor: '#FF4C29',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
};

  return (
    <div className="graph-container">
      <Line data={data}/>
    </div>
  )
}

export default GraphContainer
