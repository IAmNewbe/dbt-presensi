import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchTribes, Tribe, Daily, fetchDailyReport } from '../../pages/Dashboard/Data';

interface ChartThreeState {
  series: number[];
  labels: string[];
}

const options: ApexOptions = {
  chart: {
    width: 480,
    type: 'pie',
    fontFamily: 'Nunito, sans-serif',
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '14px',
      colors: ['#ffffff', '#ffffff','#ffffff','#ffffff']
    },
    background: {
      enabled: true,
      foreColor: '#fff',
      padding: 4,
      borderRadius: 2,
      borderWidth: 1,
      borderColor: '#fff',
      opacity: 0.9,
      dropShadow: {
        enabled: false,
        top: 1,
        left: 1,
        blur: 1,
        color: '#ffffff',
        opacity: 0.45
      }
    },
    dropShadow: {
      enabled: false,
      top: 1,
      left: 1,
      blur: 1,
      color: '#ffffff',
      opacity: 0.45
    }
  },
  colors: ['#6574CD','#9561E2','#F6993F','#38C172','#E3342F', '#FFED4A', '#2684FF','#F66D9B','#4DC0B5'],
  // labels: ['1','2','3','4','5','6','7','8','9'],
  responsive: [
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: 'bottom',
          horizontalAlign: "left",
        },
      },
    },
  ],
}

interface ChartPeriodState {
  period: string;
}

const ChartFour: React.FC<ChartPeriodState> = ({ period }) => {
  const [dailyData, setDailyData] = useState<Daily[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('On Time');
  const [state, setState] = useState<ChartThreeState>({
    series: [],
    labels: [],
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
    const filteredData = dailyData.map((group) => {
      const count = group.data.filter(
        (item) => item.status.toLowerCase() === statusFilter.toLowerCase()
      ).length;
      return { group: group.group, count };
    });

    setState({
      series: filteredData.map((item) => item.count),
      labels: filteredData.map((item) => item.group),
    });
  }, [dailyData, statusFilter]);

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Attendance by Tribe
          </h5>
        </div>
        <div>
          <div className="relative z-20 inline-block">
          <label className="flex items-center gap-2">
            <p className="flex font-semibold">Status:</p>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="ml-1  bg-white text-black-0 dark:border-strokedark dark:text-white dark:bg-boxdark border-stroke border-b"
            >
              <option value="On Time">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </label>

            <span className=" hidden absolute right-3 top-1/2 z-10 -translate-y-1/2">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                  fill="#637381"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-ye">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
           options={{
            labels: state.labels,
            legend: {
              position: "bottom",
              horizontalAlign: "left",
              // floating: true,
            },
            colors: [
              '#3C50E0', // Blue
              '#6577F3', // Light Blue
              '#facc15', // antares
              '#22C55E', // Green
              '#2684ff', // eazy
              '#FF8D21', // Yellow
              '#8B5CF6', // Purple
              '#EC4899', // Pink
              '#14B8A6'  // Teal
            ],
            dataLabels: {
              enabled: true,
              style: {
                fontSize: '14px',
                colors: ['#ffffff', '#ffffff','#ffffff','#ffffff']
              },
              background: {
                enabled: true,
                foreColor: '#fff',
                padding: 4,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: '#fff',
                opacity: 0.9,
                dropShadow: {
                  enabled: false,
                  top: 1,
                  left: 1,
                  blur: 1,
                  color: '#ffffff',
                  opacity: 0.45
                }
              },
              dropShadow: {
                enabled: false,
                top: 1,
                left: 1,
                blur: 1,
                color: '#ffffff',
                opacity: 0.45
              }
            },
            responsive: [
              {
                breakpoint: 640,
                options: {
                  chart: {
                    width: 360,
                  },
                  legend: {
                    position: 'bottom',
                    horizontalAlign: "left",
                  },
                },
              },
            ]
            }}
            series={state.series}
            type="pie"
            width={480}
          />
        </div>
      </div>

      {/* <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Presence </span>
              <span> 65% </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6577F3]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Late </span>
              <span> 34% </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Leave </span>
              <span> 12% </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#ff8d21]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Absence </span>
              <span> 45% </span>
            </p>
          </div>
        </div>
      </div> */}
    </div>      
  );
};

export default ChartFour;
