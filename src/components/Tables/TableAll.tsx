import { BRAND } from '../../types/brand';
import BrandOne from '../../images/brand/brand-01.svg';
import BrandTwo from '../../images/brand/brand-02.svg';
import BrandThree from '../../images/brand/brand-03.svg';
import BrandFour from '../../images/brand/brand-04.svg';
import BrandFive from '../../images/brand/brand-05.svg';
import { fetchTribes, Tribe, Daily, fetchDailyReport } from '../../pages/Dashboard/Data';
import React, { useState, useEffect } from 'react';
import Paginnation from '../../pages/UiElements/Pagination';
import { AllDaily, fetchAllDailyDate } from '../../types/allDaily';

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


const TableAll = () => {
  const rowsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [dailyData, setDailyData] = useState<AllDaily[]>([]);
  const [selectedTribe, setSelectedTribe] = useState<string>("All");
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string>(""); // Date state

  // Helper: Format date for comparison
  const formatDateForComparison = (dateString: string): string => {
    const [day, month, year] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  // Filtering data based on filters
  const getFilteredData = () => {
    const employeeData = dailyData.flatMap(group =>
      group.dates.flatMap(date => date.data.map(emp => ({ ...emp, date: date.date })))
    );

    return employeeData.filter(employee => {
      const tribeMatch = selectedTribe === "All" || employee.person_group === selectedTribe;
      const statusMatch = statusFilter === "All" || employee.status === statusFilter;
      const formattedEmployeeDate = employee.date ? formatDateForComparison(employee.date) : "";
      // console.log("selected :",selectedDate);
      // console.log("employed:",formattedEmployeeDate)
      const dateMatch = !selectedDate || formattedEmployeeDate === selectedDate;
      return tribeMatch && statusMatch && dateMatch;
    });
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Paginated data
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  // console.log(currentData)

  // Handlers for filters
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value);
  const handleTribeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTribe(e.target.value);
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value);
  const handlePageSelect = (page: number) => setCurrentPage(page);

  // Fetch tribes
  useEffect(() => {
    const fetchTribesData = async () => {
      try {
        const data = await fetchTribes();
        setTribes(data);
      } catch (err) {
        console.error("Error fetching tribes:", err);
      }
    };
    fetchTribesData();
  }, []);

  // Fetch daily data
  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const data = await fetchAllDailyDate();
        setDailyData(data);
      } catch (err) {
        console.error("Error fetching daily data:", err);
      }
    };
    fetchDailyData();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 lg:min-h-[636px] flex flex-col justify-between">
      {/* Filters Section */}
      <section>
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Attendance Details All Time
        </h4>

        <div className="md:flex gap-3 mb-2">
          <label className="flex mb-1 md:mb-0 gap-2">
            <p className="font-semibold">Status:</p>
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="ml-1 bg-white dark:border-strokedark dark:text-white dark:bg-boxdark border-stroke border-b"
            >
              <option value="All">All</option>
              <option value="On Time">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </label>

          <label className="flex gap-3">
            <p className="font-semibold">Date:</p>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-3/4 bg-white dark:border-strokedark dark:text-white dark:bg-boxdark border-stroke border-b"
            />
          </label>

          <label className="flex mt-1 md:mt-0 gap-2">
            <p className="font-semibold">Tribe:</p>
            <select
              value={selectedTribe}
              onChange={handleTribeChange}
              className="bg-white max-w-60 md:max-w-full dark:border-strokedark dark:text-white dark:bg-boxdark border-stroke border-b"
            >
              <option value="All">All</option>
              {tribes.map(item => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* Table Data */}
      <div className="flex flex-col flex-grow mt-6">
        <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
          <div className="p-2.5 xl:p-5"><h5 className="text-sm font-medium uppercase">Date</h5></div>
          <div className="p-2.5 text-left xl:p-5"><h5 className="text-sm font-medium uppercase">Name</h5></div>
          <div className="p-2.5 text-left xl:p-5"><h5 className="text-sm font-medium uppercase">Tribe</h5></div>
          <div className="p-2.5 text-center xl:p-5"><h5 className="text-sm font-medium uppercase">Status</h5></div>
          <div className="hidden p-2.5 text-center sm:block xl:py-5"><h5 className="text-sm font-medium uppercase">Check in Time</h5></div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5"><h5 className="text-sm font-medium uppercase">Office</h5></div>
        </div>

        {currentData.length > 0 ? (
          currentData.map((employee, key) => (
            <div key={key} className={`grid grid-cols-5 sm:grid-cols-6 border-b border-stroke dark:border-strokedark`}>
              <div className="p-2.5">{employee.date}</div>
              <div className="p-2.5">{employee.person_name}</div>
              <div className="p-2.5 text-left">{employee.person_group}</div>
              <div className="p-2.5 text-center">
                <p
                  className={`text-black ${
                    employee.status === 'On Time'
                      ? 'text-green-600'
                      : employee.status === 'Absent'
                      ? 'text-red-500'
                      : employee.status === 'Late'
                      ? 'text-blueeazy'
                      : ''
                  }`}
                >
                  {employee.status}
                </p>
              </div>
              <div className="hidden sm:block p-0 sm:p-2.5 text-center">{employee.first_access_time}</div>
              <div className="hidden sm:block p-0 sm:p-2.5 text-center">{employee.resource_name}</div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-500">No data available</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-end my-4">
        <Paginnation currentPage={currentPage} totalPages={totalPages} onPageSelect={handlePageSelect} />
      </div>
    </div>
  );
};

export default TableAll;
