import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartThreeState {
  series: number[];
}

interface ChartThreeProps {
  present: number;
  late: number;
  absent: number;
  total: number;
  tribe: string;
  name: string;
}

const options: ApexOptions = {
  chart: {
    fontFamily: 'Nunito, sans-serif',
    type: 'donut',
  },
  colors: ['#3C50E0', '#6577F3', '#ff8d21'],
  labels: ['Presence', 'Late', 'Absence'],
  legend: {
    show: false,
    position: 'bottom',
  },

  plotOptions: {
    pie: {
      donut: {
        size: '55%',
        background: 'transparent',
        labels: {
          show: true,
        }
      },
    },
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
    },
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree: React.FC<ChartThreeProps> = ({ present, late, absent, total, tribe, name}) => {
  // const [total, setTotal] = useState(0);
  const [state, setState] = useState<ChartThreeState>({
    series: [present, late, absent],
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
      series: [present, late, absent],
    }));
  };
  handleReset;

  useEffect(() => {
    setState({
      series: [present, late, absent],
    });
  }, [present, late, absent]);

  console.log(state.series)

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm bg-white px-5 pb-5 pt-2 dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4">
        <div className='grid grid-cols-3'>
          <h5 className="border-b pb-1 col-span-1 font-semibold text-base text-black dark:text-white">
            Name
          </h5>
          <h5 className="border-b pb-1 col-span-2 text-base text-black dark:text-white">
            {name}
          </h5> 
        </div>
        <div className='grid grid-cols-3'>
          <h5 className="col-span-1 pt-1 font-semibold text-base text-black dark:text-white">
            Tribe
          </h5>
          <h5 className="col-span-2 pt-1 text-sm text-black dark:text-white">
            {tribe}
          </h5> 
        </div>
        <div>
          <div className="relative z-20 inline-block">

          </div>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-left gap-y-3">
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Presence : {present} </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6577F3]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Late : {late} </span>
            </p>
          </div>
        </div>
        {/* <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Total Employee </span>
              <span> {total}</span>
            </p>
          </div>
        </div> */}
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#ff8d21]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Absence : {absent} </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
