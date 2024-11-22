import { Link } from 'react-router-dom';
import { Log, fetchLogData } from '../../types/chat';
import UserOne from '../../images/user/user-01.png';
import UserTwo from '../../images/user/user-02.png';
import UserThree from '../../images/user/user-03.png';
import UserFour from '../../images/user/user-04.png';
import UserFive from '../../images/user/user-05.png';
import React, {useEffect, useState} from 'react';

const logData: Log[] = [
  {
    id: 6315,
    employee_id: "4351949887",
    access_date: "2024-11-20T17:00:00.000Z",
    access_time: "11:09:42",
    auth_type: "ACSEventFaceVerifyPass",
    resource_name: "Antares Office",
    person_name: "Indra",
    person_group: "IoT Platform & Services > Antares Enterprise",
    attendance_status: "CHECK-IN"
  }
];

const ChatCard = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchLogs = async () => {
      try {
        const data = await fetchLogData();
        setLogs(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    // Initial fetch
    fetchLogs();

    // Set up polling every 2 seconds
    interval = setInterval(() => {
      fetchLogs();
    }, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Latest Activities
      </h4>

      <div>
        {logs.map((log, key) => (
          <Link
            to="/"
            className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="relative h-16 w-16 rounded-full">
              <img src={UserOne} alt="User halo" />
              <span
                className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white"
                style={{backgroundColor: 'green'}}
              ></span>
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <div className='flex'>
                  <h5 className="font-bold text-sm text-black dark:text-white">
                    {log.person_name.slice(0, 10) + "..."} | 
                  </h5>
                  <h5 className="ml-1 font-medium text-xs align-middle m-auto text-gray-900 dark:text-white">
                  {log.person_group.slice(0, 10) + "..."}
                  </h5>
                </div>
                
                <p>
                  <span className="text-sm text-black dark:text-white">
                    {log.resource_name}
                  </span>
                  <span className="text-xs"> . {log.access_time} WIB</span>
                </p>

                <p>
                  <span className="text-xs text-black dark:text-white">
                    {log.auth_type}
                  </span>
                  {/* <span className="text-xs"> . {log.access_time} WIB</span> */}
                </p>
              </div>

              {/* {log.textCount !== 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-medium text-white">
                    {' '}
                    {log.textCount}
                  </span>
                </div>
              )} */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatCard;
