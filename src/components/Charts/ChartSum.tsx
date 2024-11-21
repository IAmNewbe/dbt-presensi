import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartAreaState {
  series: { name: string; data: number[] }[];
}

const options: ApexOptions = {
  chart: {
    fontFamily: 'Nunito, sans-serif',
    type: 'area',
    height: 350,
  },
  colors: ['#3C50E0', '#6577F3', '#0FADCF', '#ff8d21'],
  stroke: {
    curve: 'smooth',
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    categories: [
      '2018-09-19T00:00:00.000Z',
      '2018-09-19T01:30:00.000Z',
      '2018-09-19T02:30:00.000Z',
      '2018-09-19T03:30:00.000Z',
      '2018-09-19T04:30:00.000Z',
      '2018-09-19T05:30:00.000Z',
      '2018-09-19T06:30:00.000Z',
      '2018-09-19T07:30:00.000Z',
      '2018-09-19T08:30:00.000Z',
      '2018-09-19T09:30:00.000Z',
      '2018-09-19T10:30:00.000Z',
    ],
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy HH:mm',
    },
  },
};

const ChartSum: React.FC = () => {
  const [state, setState] = useState<ChartAreaState>({
    series: [
      {
        name: 'Presence',
        data: [31, 40, 28, 51, 42, 109, 100,40, 28, 51, 23],
      },
      {
        name: 'Late',
        data: [11, 32, 45, 32, 34, 52, 41, 32, 45, 32, 12],
      },
      {
        name: 'Leave',
        data: [15, 22, 15, 52, 24, 12, 21, 22, 15, 52, 3],
      },
      {
        name: 'Absence',
        data: [1, 3, 5, 12, 14, 2, 24, 3, 5, 12, 20],
      },
    ],
  });

  const handleReset = () => {
    setState({
      series: [
        {
          name: 'Presence',
          data: [31, 40, 28, 51, 42, 109, 100,40, 28, 51, 23],
        },
        {
          name: 'Late',
          data: [11, 32, 45, 32, 34, 52, 41, 32, 45, 32, 12],
        },
        {
          name: 'Leave',
          data: [15, 22, 15, 52, 24, 12, 21, 22, 15, 52, 3],
        },
        {
          name: 'Absence',
          data: [1, 3, 5, 12, 14, 2, 24, 3, 5, 12, 20],
        },
      ],
    });
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-2 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Attendance Records
          </h5>
        </div>
        <div>
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-blueeazy text-white rounded-md"
          >
            Reset Chart
          </button>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartArea" className="mx-auto">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSum;
