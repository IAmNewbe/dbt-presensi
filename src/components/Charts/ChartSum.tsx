import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchResumePresence } from '../../pages/Dashboard/Data';

// Contoh tipe data untuk harian (Daily)
interface Daily {
  group: string;
  data: { date: string; status: { Presence: number; Late: number; Absence: number } }[];
}

interface ChartAreaState {
  series: { name: string; data: number[] }[];
  categories: string[]; // Menambahkan kategori untuk tanggal
}

const options: ApexOptions = {
  chart: {
    fontFamily: 'Nunito, sans-serif',
    type: 'area',
    height: 350,
    zoom: {
      enabled: true, // Mengaktifkan zoom
    },
  },
  colors: ['#3C50E0', '#2684ff', '#ff8d21'],
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: 'category',
    categories: [], // Kategori ini akan diupdate secara dinamis
    labels: {
      rotate: -45, // Rotasi label agar tidak bertumpuk
      hideOverlappingLabels: true, // Sembunyikan label yang bertumpuk
      formatter: function (val: string) {
        // Memformat tanggal agar menampilkan hari, bulan, dan tahun
        const date = new Date(val);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' });
      },
    },
    tickAmount: 6, // Batas jumlah tick yang ditampilkan
  },
  tooltip: {
    x: {
      format: 'dd/MM/yyyy', // Format tanggal pada tooltip
    },
  },
};



interface ChartPeriodState {
  period: string;
  tribe: string;
}

const ChartSum: React.FC<ChartPeriodState> = ({ period, tribe }) => {
  const [dailyData, setDailyData] = useState<Daily[]>([]); // Data harian
  const [key, setKey] = useState(0);
  const [state, setState] = useState<ChartAreaState>({
    series: [
      { name: 'Presence', data: [] },
      { name: 'Late', data: [] },
      { name: 'Absence', data: [] },
    ],
    categories: [], // Menambahkan categories
  });

  const handleReset = () => {
    setKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    if (period === 'Daily') {
      const fetchDailyData = async () => {
        // Fetch data dari API
        const fetchedData = await fetchResumePresence(); // Mengambil data seperti JSON yang Anda kirimkan
        const accumulatedData: { [key: string]: { Presence: number; Late: number; Absence: number } } = fetchedData;
  
        // Memformat data ke dalam bentuk yang sesuai
        const categories = Object.keys(accumulatedData);
  
        setState({
          series: [
            { name: 'Presence', data: categories.map((date) => accumulatedData[date].Presence) },
            { name: 'Late', data: categories.map((date) => accumulatedData[date].Late) },
            { name: 'Absence', data: categories.map((date) => accumulatedData[date].Absence) },
          ],
          categories, // Update categories dengan tanggal
        });
      };
      
      fetchDailyData();
      
    }
  }, [period, tribe]);
  

 
  
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-2 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            All Attendance Records
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
        <div id="chartArea" key={key} className="mx-auto">
          <ReactApexChart
            options={{
              ...options,
              xaxis: { ...options.xaxis, categories: state.categories }, // Update categories
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
