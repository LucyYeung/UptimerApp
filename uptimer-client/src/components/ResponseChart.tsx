import React, { FC, ReactElement } from 'react';

import { IHeartbeat } from '@/interfaces/monitor.interface';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJs,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  TooltipItem,
} from 'chart.js';
import dayjs from 'dayjs';
import { Chart } from 'react-chartjs-2';

ChartJs.register(
  LineController,
  BarController,
  LineElement,
  PointElement,
  TimeScale,
  BarElement,
  LinearScale,
  Tooltip,
  Filler,
  CategoryScale
);

interface IResponseChartProps {
  heartBeats: IHeartbeat[];
  showLabel?: boolean;
}

const ResponseChart: FC<IResponseChartProps> = ({
  heartBeats,
  showLabel = true,
}): ReactElement => {
  const labels = heartBeats.map((beat: IHeartbeat) =>
    dayjs(JSON.parse(`${beat.timestamp}`)).format('HH:mm')
  );
  const data = heartBeats.map((beat: IHeartbeat) => beat.responseTime);
  const footer = (tooltipItems: TooltipItem<'line'>[]) => {
    return `Response Time: ${tooltipItems[0].raw} ms`;
  };

  return (
    <div>
      <Chart
        type='line'
        data={{
          labels,
          datasets: [
            {
              data,
              borderColor: '#008FFB',
              backgroundColor: '#DDEFFE',
              yAxisID: 'y',
              fill: true,
              tension: 0.15,
            },
          ],
        }}
        options={{
          responsive: true,
          interaction: {
            intersect: false,
            mode: 'index',
          },
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text: 'API Response Time',
            },
            tooltip: {
              callbacks: {
                footer,
              },
            },
          },
          layout: { padding: { left: 10, right: 30, top: 30, bottom: 10 } },
          elements: { point: { radius: 0, hitRadius: 100 } },
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: false,
                text: 'Time',
              },
              grid: {
                display: false,
                drawOnChartArea: false,
                drawTicks: true,
              },
              ticks: { maxRotation: 0, autoSkipPadding: 20 },
            },
            y: {
              title: {
                display: true,
                text: showLabel ? 'Response Time (ms)' : '',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ResponseChart;
