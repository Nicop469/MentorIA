import React from 'react';
import { QuestionAttempt } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceChartProps {
  attempts: QuestionAttempt[];
  type?: 'line' | 'bar';
  title?: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  attempts, 
  type = 'line',
  title = 'Performance Over Time'
}) => {
  const labels = attempts.map((_, index) => `Q${index + 1}`);
  
  const difficultyData = {
    labels,
    datasets: [
      {
        label: 'Difficulty Level',
        data: attempts.map(attempt => attempt.difficulty),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
      },
    ],
  };

  const timeData = {
    labels,
    datasets: [
      {
        label: 'Time Taken (seconds)',
        data: attempts.map(attempt => attempt.timeTaken),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
      },
    ],
  };

  const correctnessData = {
    labels,
    datasets: [
      {
        label: 'Correct Answers',
        data: attempts.map(attempt => attempt.correct ? 1 : 0),
        backgroundColor: attempts.map(attempt => 
          attempt.correct ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'
        ),
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
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const renderChart = (data: any, chartTitle: string) => {
    const chartOptions = {
      ...options,
      plugins: {
        ...options.plugins,
        title: {
          ...options.plugins.title,
          text: chartTitle,
        },
      },
    };

    if (type === 'line') {
      return <Line options={chartOptions} data={data} />;
    }
    return <Bar options={chartOptions} data={data} />;
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-lg shadow">
        {renderChart(difficultyData, 'Difficulty Progression')}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        {renderChart(timeData, 'Time Taken Per Question')}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <Bar 
          options={{
            ...options,
            plugins: {
              ...options.plugins,
              title: {
                ...options.plugins.title,
                text: 'Question Results',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 1,
                ticks: {
                  callback: function(value: any) {
                    return value === 0 ? 'Incorrect' : value === 1 ? 'Correct' : '';
                  }
                }
              }
            }
          }} 
          data={correctnessData} 
        />
      </div>
    </div>
  );
};

export default PerformanceChart;