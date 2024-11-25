import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/light.css'; // Import tema untuk date picker
import { fetchResumePresence } from '../../pages/Dashboard/Data';

interface Daily {
  group: string;
  data: { date: string; status: { Presence: number; Late: number; Absence: number } }[];
}

interface ChartAreaState {
  series: { name: string; data: number[] }[];
  categories: string[];
}

interface ChartPeriodState {
  period: string;
  tribe: string;
}

const options = {
  chart: {
    fontFamily: 'Nunito, sans-serif',
    type: 'area',
    height: 350,
    zoom: {
      enabled: true,
    },
  },
  colors: ['#3C50E0', '#2684ff', '#ff8d21'],
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: 'category',
    categories: [],
    labels: {
      rotate: -45,
      hideOverlappingLabels: true,
      formatter: function (val: string) {
        const date = new Date(val);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' });
      },
    },
    tickAmount: 6,
  },
  tooltip: {
    x: {
      format: 'dd/MM/yyyy',
    },
  },
};

const ChartSum: React.FC<ChartPeriodState> = ({ period, tribe }) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [state, setState] = useState<ChartAreaState>({
    series: [
      { name: 'Presence', data: [] },
      { name: 'Late', data: [] },
      { name: 'Absence', data: [] },
    ],
    categories: [],
  });

  useEffect(() => {
    // Inisialisasi flatpickr untuk input date picker
    flatpickr('#startDate', {
      dateFormat: 'Y-m-d',
      defaultDate: getDefaultStartDate(), // Set tanggal mulai default ke 7 hari yang lalu
      onChange: (selectedDates) => setStartDate(selectedDates[0]?.toISOString().split('T')[0] || null),
    });
    flatpickr('#endDate', {
      dateFormat: 'Y-m-d',
      defaultDate: getTodayDate(), // Set tanggal akhir default ke hari ini
      onChange: (selectedDates) => setEndDate(selectedDates[0]?.toISOString().split('T')[0] || null),
    });
  }, []);

  // Fungsi untuk menghitung tanggal 7 hari yang lalu
  const getDefaultStartDate = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6); // 6 hari sebelum hari ini (total 7 hari)
    return startDate.toISOString().split('T')[0];
  };

  // Fungsi untuk mendapatkan tanggal hari ini
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchFilteredData = async () => {
      if (period === 'Daily' && startDate && endDate) {
        const fetchedData = await fetchResumePresence(); // Ambil data dari API
        const accumulatedData: { [key: string]: { Presence: number; Late: number; Absence: number } } = fetchedData;

        // Filter data berdasarkan tanggal
        const filteredCategories = Object.keys(accumulatedData).filter(
          (date) => date >= startDate && date <= endDate
        );

        setState({
          series: [
            { name: 'Presence', data: filteredCategories.map((date) => accumulatedData[date].Presence) },
            { name: 'Late', data: filteredCategories.map((date) => accumulatedData[date].Late) },
            { name: 'Absence', data: filteredCategories.map((date) => accumulatedData[date].Absence) },
          ],
          categories: filteredCategories,
        });
      }
    };

    fetchFilteredData();
  }, [period, startDate, endDate, tribe]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-2 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">All Attendance Records</h5>
        </div>
        <div className="flex gap-2">
          <input
            id="startDate"
            placeholder="Start Date"
            className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <input
            id="endDate"
            placeholder="End Date"
            className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-2">
        <div id="chartArea" className="mx-auto">
          <ReactApexChart
            options={{
              ...options,
              xaxis: { ...options.xaxis, categories: state.categories },
            }}
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
