import { BRAND } from '../../types/brand';
import BrandOne from '../../images/brand/brand-01.svg';
import BrandTwo from '../../images/brand/brand-02.svg';
import BrandThree from '../../images/brand/brand-03.svg';
import BrandFour from '../../images/brand/brand-04.svg';
import BrandFive from '../../images/brand/brand-05.svg';
import { fetchTribes, Tribe, Daily, fetchDailyReport } from '../../pages/Dashboard/Data';
import React, { useState, useEffect } from 'react';
import Paginnation from '../../pages/UiElements/Pagination';

interface Employee {
  employee_id: string;
  person_name: string;
  person_group: string;
  first_access_time: string;
  status: string;
  auth_type: string;
  attendance_status: string;
  resource_name: string;
}

interface Group {
  group: string;
  data: Employee[];
}

interface Data {
  id: number;
  name: string;
  status: string;
}

interface TableFixedDateProps {
  date: string;
}

const TableFixedDate: React.FC<TableFixedDateProps> = ({ date }) => {
  const rowsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [dailyData, setDailyData] = useState<Daily[]>([]);
  const [selectedTribe, setSelectedTribe] = useState<string>('All');
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [personGroupFilter, setPersonGroupFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const formated = new Date(date);
  const formattedDate = formated.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const employeeData =  dailyData.flatMap((group) => group.data);
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
  };

  const handleTribeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedTribe(selectedValue);
   
  };

  const filteredData = employeeData.filter((employee) => {
    const tribeMatch = selectedTribe === 'All' || employee.person_group === selectedTribe;
    const statusMatch = statusFilter === 'All' || employee.status === statusFilter;
    return tribeMatch && statusMatch; // Both filters must match
  });

  useEffect(() => {
    const getTribes = async () => {
      try {
        const data = await fetchTribes(); // Fetch tribes using the service
        setTribes(data);
      } catch (err) {
        console.error('Error fetching tribes:', err);
        // if (err.response?.status === 401) {
        //   console.error('Unauthorized. Redirecting to login.');
        //   // Redirect to sign-in page
        //   window.location.href = '/';
        // }
      }
    };
    getTribes();
  }, [dailyData]);

  useEffect(() => {
    // Simulate fetching Daily data
    const fetchDailyData = async () => {
      const late = "09:00";
      const data = await fetchDailyReport(date, late);
      setDailyData(data);
      // console.log("table data : ");
      // console.log(dailyData);
    };
    fetchDailyData();
  }, [dailyData]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 lg:min-h-[636px] flex flex-col justify-between">
  <section>
    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
      Attendance Details on <span className='text-blueeazy'>{formattedDate}</span> 
    </h4>

    <div className="md:flex gap-3 mb-2">
      <label className="flex mb-1 md:mb-0 gap-2">
        <p className="font-semibold">Status:</p>
        <select
          className="ml-1 bg-white text-black-0 dark:border-strokedark dark:text-white dark:bg-boxdark border-stroke border-b"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <option value="All">All</option>
          <option value="On Time">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
      </label>

      <label className="flex mt-1 md:mt-0 gap-2">
        <p className="font-semibold">Tribe:</p>
        <select
          id="tribe-select"
          value={selectedTribe}
          onChange={handleTribeChange}
          className="bg-white text-black-0 max-w-60 md:max-w-full dark:border-strokedark dark:text-white dark:bg-boxdark border-stroke border-b"
        >
          <option value="All">All</option>
          {tribes.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  </section>

  <div className="flex flex-col flex-grow mt-6">
    {/* Header Tabel */}
    <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
      <div className="p-2.5 xl:p-5">
        <h5 className="text-sm font-medium uppercase">Name</h5>
      </div>
      <div className="p-2.5 text-center xl:p-5">
        <h5 className="text-sm font-medium uppercase">Tribe</h5>
      </div>
      <div className="p-2.5 text-center xl:p-5">
        <h5 className="text-sm font-medium uppercase">Status</h5>
      </div>
      <div className="hidden p-2.5 text-center sm:block xl:py-5">
        <h5 className="text-sm font-medium uppercase">Check in Time</h5>
      </div>
      <div className="hidden p-2.5 text-center sm:block xl:p-5">
        <h5 className="text-sm font-medium uppercase">Office</h5>
      </div>
    </div>

    {/* Data atau Baris Kosong */}
    {currentData.length > 0
      ? currentData.map((brand, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === dailyData.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 text-sm">
              <p className=" text-black dark:text-white sm:block">
                {brand.person_name}
              </p>
            </div>

            <div className="flex items-center justify-start p-2.5 text-sm">
              <p className="text-black dark:text-white">
                {brand.person_group}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 text-sm">
              <p
                className={`text-black ${
                  brand.status === 'On Time'
                    ? 'text-green-600'
                    : brand.status === 'Absent'
                    ? 'text-red-500'
                    : brand.status === 'Late'
                    ? 'text-blueeazy'
                    : ''
                }`}
              >
                {brand.status}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex text-sm">
              <p className="text-black dark:text-white">
                {brand.first_access_time}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex text-sm">
              <p className="text-meta-5">{brand.resource_name}</p>
            </div>
          </div>
        ))
      : Array.from({ length: rowsPerPage }).map((_, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 sm:grid-cols-5 border-b border-stroke dark:border-strokedark"
          >
            <div className="p-2.5 text-sm text-gray-400 dark:text-gray-500">
              No Data
            </div>
            <div className="p-2.5 text-sm text-gray-400 dark:text-gray-500">
              -
            </div>
            <div className="p-2.5 text-sm text-gray-400 dark:text-gray-500">
              -
            </div>
            <div className="hidden p-2.5 text-sm text-gray-400 dark:text-gray-500 sm:block">
              -
            </div>
            <div className="hidden p-2.5 text-sm text-gray-400 dark:text-gray-500 sm:block">
              -
            </div>
          </div>
        ))}
  </div>

  {/* Pagination */}
  <div className="flex justify-end mt-2 mb-5">
    <Paginnation
      currentPage={currentPage}
      totalPages={totalPages}
      onPageSelect={handlePageSelect}
    />
  </div>
</div>

  );
};

export default TableFixedDate;
