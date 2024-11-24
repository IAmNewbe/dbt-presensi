import { Person } from '../../types/person';
import React, {useState, useEffect} from 'react';
import { fetchAllReportByName } from '../../types/person';
import ProductOne from '../../images/product/product-01.png';
import ProductTwo from '../../images/product/product-02.png';
import ProductThree from '../../images/product/product-03.png';
import ProductFour from '../../images/product/product-04.png';
import Pagination from '../../pages/UiElements/Pagination';
import Loader from '../../common/Loader';
import ChartThree from './ChartPerson';

interface Report {
  group: string;
  dates: {
    date: string;
    data: {
      employee_id: string;
      person_name: string;
      person_group: string;
      first_access_time: string;
      status: string;
      auth_type: string;
      attendance_status: string;
      resource_name: string;
    }[];
  }[];
}

const TableTwo = () => {
  const rowsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusCount, setStatusCount] = useState<{ [key: string]: number }>({
    'On Time': 0,
    'Absent': 0,  // Now will count "N/A" as "Absent"
    'Late': 0,
    // Add more statuses if needed
  });
  
  const countStatuses = (reports: Report[]) => {
    const count = {
      'On Time': 0,
      'Absent': 0,  // This will include "N/A" as well
      'Late': 0,
      // Add more statuses if needed
    };

    reports.forEach((report) => {
      report.dates?.forEach((dateItem) => {
        dateItem.data?.forEach((person) => {
          if (person.status === 'N/A') {
            count['Absent']++; // Treat "N/A" as "Absent"
          } else if (person.status in count) {
            count[person.status]++; // Count other statuses
          } else {
            count['Absent']++; // Default to "Absent" if status is unknown
          }
        });
      });
    });

    return count;
  };

  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchAllReportByName(searchTerm);
      setReports(result);
      const counts = countStatuses(result);
      setStatusCount(counts);
    } catch (err) {
      if(err.status === 404) {
        setError("No Data Found");
      } else {
        setError('Failed to fetch reports. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const flattenReports = reports.flatMap((report) =>
    report.dates.flatMap((dateItem) =>
      dateItem.data.map((person) => ({
        date: dateItem.date,
        ...person, // Merge the person's details with the date
      }))
    )
  );

  // Pagination logic
  const totalPages = Math.ceil(flattenReports.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = flattenReports.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <div className='md:flex justify-between'>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Find Person All Reports
          </h4>

          <section className='flex gap-2 mt-2 md:mt-0'>
            <input
              type="text"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent px-4 text-black border focus:outline-none dark:text-white xl:w-80 rounded-sm"
            />
            <button onClick={handleSearch} className='hover:text-blueeazy'>search</button>
          </section>
          
        </div>
      </div>

      
      <section className='lg:flex'>
        <div className='w-full lg:w-2/5'>
        {reports.length > 0 && (
          <ChartThree
            name={reports[0].dates[0].data[0].person_name}
            tribe={reports[0].group}
            present={statusCount['On Time']}
            absent={statusCount['Absent']}
            late={statusCount['Late']}
            total={statusCount['On Time'] + statusCount['Absent'] + statusCount['Late']}
          />
        )}
        </div>

        <div className='w-full lg:w-3/5'>
          <div className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
            <div className="col-span-2 flex items-center">
              <p className="font-medium">Date</p>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="font-medium">Check In Time</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Status</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Office</p>
            </div>
          </div>

        {loading ? (
          <Loader />
        ): error ? ( 
          <p className="text-center py-3 font-satoshi font-semibold text-red-500">{error}</p>
        ): (
          <div>
            {currentData.length > 0 ? (
              currentData.map((person, index) => (
                <div
                  className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                  key={`${person.employee_id}-${index}`}
                >
                  <div className="col-span-2 flex items-center">
                    <p className="text-sm text-black dark:text-white">
                      {new Intl.DateTimeFormat('en-UK', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(new Date(person.date))}
                    </p>
                  </div>
                  <div className="col-span-2 hidden items-center sm:flex">
                    <p className="text-sm text-black dark:text-white">{person.first_access_time}</p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <p
                      className={`text-black ${
                        person.status === 'On Time'
                          ? 'text-green-600'
                          : person.status === 'Absent'
                          ? 'text-red-500'
                          : person.status === 'Late'
                          ? 'text-blue-500'
                          : ''
                      }`}
                    >
                      {person.status}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <p className="text-sm text-black dark:text-white">{person.resource_name}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-center'>Type To Find</p>
            )}
          </div>
        )}
        </div>
      </section>

      <div className='flex pb-4 px-4 justify-end w-full'>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageSelect={handlePageSelect}
        />
      </div>
      
    </div>
  );
};

export default TableTwo;
