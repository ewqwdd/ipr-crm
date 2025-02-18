import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  TooltipItem,
} from 'chart.js';
import { EvaulatorType } from '@/entities/rates/types/types';
import { getAyeChartData } from './helpers';
import { FC } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface ChartOptions {
  responsive: boolean;
  animation: {
    duration: number;
    easing: 'easeOutBounce';
  };
  scales: {
    y: {
      beginAtZero: boolean;
      ticks: {
        stepSize: number;
      };
    };
  };
  plugins: {
    legend: {
      position: 'top';
    };
    tooltip: {
      callbacks: {
        label: (tooltipItem: TooltipItem<'bar'>) => string | void | string[];
      };
    };
  };
}

type AyeChartProps = {
  data: Record<EvaulatorType, number>;
  label?: string;
};

const options: ChartOptions = {
  responsive: true,
  animation: {
    duration: 1500,
    easing: 'easeOutBounce',
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: TooltipItem<'bar'>): string {
          const datasetLabel = tooltipItem.dataset.label ?? '';
          const value = tooltipItem.raw as number;
          return `${datasetLabel} ${value}`;
        },
      },
    },
  },
};

const AyeChart: FC<AyeChartProps> = ({ data, label = '' }) => {
  const ayeData: ChartData<'bar'> = getAyeChartData(data, label);

  return (
    <>
      <h2 className="text-2xl mt-20 mb-5 ">Диаграмма общих результатов</h2>
      <div style={{ width: '1050px', height: '525px' }}>
        <Bar data={ayeData} options={options} />
      </div>
    </>
  );
};

export default AyeChart;
