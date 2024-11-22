import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchTribes, Tribe, Daily, fetchDailyReport } from '../../pages/Dashboard/Data';

interface ChartAreaState {
  series: { name: string; data: number[] }[];
}

const options: ApexOptions = {
  chart: {
    fontFamily: 'Nunito, sans-serif',
    type: 'area',
    height: 350,
  },
  colors: ['#3C50E0', '#2684ff', '#ff8d21'],
  // stroke: {
  //   curve: 'smooth',
  // },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    categories: [
      '2018-09-19T06:00:00.000Z',
      '2018-09-19T07:30:00.000Z',
      '2018-09-19T08:30:00.000Z',
      '2018-09-19T09:30:00.000Z',
      '2018-09-19T10:30:00.000Z',
      '2018-09-19T11:30:00.000Z',
      '2018-09-19T12:30:00.000Z',
      '2018-09-19T13:30:00.000Z',
      '2018-09-19T14:30:00.000Z',
      '2018-09-19T15:30:00.000Z',
      '2018-09-19T16:30:00.000Z',
    ],
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy HH:mm',
    },
  },
};

interface ChartPeriodState {
  period: string;
  tribe: string;
}

const ChartSum: React.FC<ChartPeriodState> = ({ period, tribe }) => {
  const [dailyData, setDailyData] = useState<Daily[]>([]);
  const [key, setKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('On Time');
  const [state, setState] = useState<ChartAreaState>({
    series: [
      { name: 'Presence', data: [] },
      { name: 'Late', data: [] },
      { name: 'Absence', data: [] },
    ],
  });

  useEffect(() => {
    if (period === "Daily") {
      const fetchDailyData = async () => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const late = "09:00";
        const data = await fetchDailyReport(formattedDate, late);
        setDailyData(data);
      };
      fetchDailyData();
    }
  }, [period]);

  useEffect(() => {
    // Filter data for the selected group
    const groupData = dailyData.find((d) => d.group === tribe);

    if (groupData) {
      // Aggregate status counts
      const statusCounts = {
        Presence: 0,
        Late: 0,
        Absence: 0,
      };

      groupData.data.forEach((entry) => {
        if (entry.status === 'On Time') statusCounts.Presence++;
        if (entry.status === 'Late') statusCounts.Late++;
        if (entry.status === 'Absent') statusCounts.Absence++;
      });

      // Update the chart series
      setState({
        series: [
          { name: 'On Time', data: [statusCounts.Presence] },
          { name: 'Late', data: [statusCounts.Late] },
          { name: 'Absence', data: [statusCounts.Absence] },
        ],
      });

      console.log(statusCounts.Presence);
    }
  }, [dailyData, tribe]);

  const handleReset = () => {
    setKey((prevKey) => prevKey + 1);
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

      <div className="mb-2" >
        <div id="chartArea" key={key} className="mx-auto">
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
