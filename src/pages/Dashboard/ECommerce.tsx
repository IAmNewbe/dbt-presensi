import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import ChatCard from '../../components/Chat/ChatCard';
import TableOne from '../../components/Tables/TableOne';
import ChartSum from '../../components/Charts/ChartSum';
import ChartFour from '../../components/Charts/ChartFour';
import { fetchTribes, Tribe, Daily, fetchDailyReport } from './Data';
import React, { useState, useEffect } from 'react';
import DownloadButton from '../../components/Buttons/downloadButton';
import { toast, ToastContainer } from 'react-toastify';
import Datepicker from "tailwind-datepicker-react";
import { setData } from './Filters';
import { useNavigate } from 'react-router-dom';
import TableFixedDate from '../../components/Tables/TableFixedDate';

const options = {
	title: "Select date",
	autoHide: true,
	todayBtn: true,
	clearBtn: true,
	clearBtnText: "Clear",
	maxDate: new Date("2030-01-01"),
	minDate: new Date("1950-01-01"),
	theme: {
		background: "bg-white dark:bg-gray-800",
		todayBtn: "",
		clearBtn: "",
		icons: "",
		text: "",
		disabledText: "#d3d3d3", // Add this property
    // selectedts: "#ffeb3b",
		input: "",
		inputIcon: "",
		selected: "",
	},
	// icons: {
	// 	// // () => ReactElement | JSX.Element
	// 	// prev: () => <span>Prev</span>,
	// 	// next: () => <span>Next</span>,
	// },
	datepickerClassNames: "top-20",
	// defaultDate: new Date(),
	language: "en",
	disabledDates: [],
	weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
	inputNameProp: "date",
	inputIdProp: "date",
	inputPlaceholderProp: "Select Date",
	inputDateFormatProp: {
		day: "numeric",
		month: "long",
		year: "numeric"
	}
}

const ECommerce: React.FC = () => {
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [dailyData, setDailyData] = useState<Daily[]>([]); // All Daily data
  const [filteredData, setFilteredData] = useState<Daily[]>([]); // Filtered data for display
  const [selectedTribe, setSelectedTribe] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [absentCount, setAbsentCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [show, setShow] = useState<boolean >(false);
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const navigate = useNavigate();

  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error(`Session time out, please log in again`, { position: toast.POSITION.TOP_CENTER, autoClose: false });
      navigate('/');
      window.location.reload();
    }
  }
  
	const handleChange = (selectedDate: Date) => {
    const formattedDate = selectedDate.toLocaleDateString('en-CA');
    setDate(formattedDate);
    setData(selectedTribe, formattedDate);
    filterData(selectedTribe, formattedDate);
	}

	const handleClose = (state: boolean) => {
		setShow(state)
	}

  useEffect(() => {
    const interval = setInterval(() => {
      checkToken();
    }, 2000);
    return () => clearInterval(interval);
  }, []);
 
  useEffect(() => {
    const fetchDailyData = async () => {
      const late = "09:00";
      const data = await fetchDailyReport(date, late);
      setDailyData(data);
    };

    fetchDailyData();
  }, [date]);

  useEffect(() => {
    const getTribes = async () => {
      try {
        const data = await fetchTribes(); // Fetch tribes using the service
        setTribes(data);
      } catch (err) {
        const token = localStorage.getItem('token');
        if (!token) {
          // toast.error(`${err}, please log in again`, { position: toast.POSITION.TOP_CENTER, autoClose: false });
        } else {
          toast.error(`${err}`, { position: toast.POSITION.TOP_CENTER, autoClose: false });
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getTribes();
  }, []);

  const handleTribeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedTribe(selectedValue);
    filterData(selectedValue, date);
    setData(selectedValue, date);
  };

  const countAbsentEmployees = (data: any[]) => {
    let absentCount = 0;
    data.forEach((group) => {
      const absentEmployees = group.data.filter((employee) => employee.status === 'Absent' || employee.status === 'N/A');
      absentCount += absentEmployees.length; // Add to the count
    });

    return absentCount;
  };

  const countPresenceEmployees = (data: any[]) => {
    let presentCount = 0;
    data.forEach((group) => {
      const presentEmployees = group.data.filter((employee) => employee.status === 'On Time');
      presentCount += presentEmployees.length; // Add to the count
    });

    return presentCount;
  };
  
  const countLateEmployees = (data: any[]) => {
    let lateCount = 0;
    data.forEach((group) => {
      const lateEmployees = group.data.filter((employee) => employee.status === 'Late');
      lateCount += lateEmployees.length; // Add to the count
    });

    return lateCount;
  };

  const setCardData = (data: any[]) => {
    const presentCounter = countPresenceEmployees(data);
    const absentCounter = countAbsentEmployees(data);
    const lateCounter = countLateEmployees(data);
    setPresentCount(presentCounter);
    setAbsentCount(absentCounter);
    setLateCount(lateCounter);
    setTotalEmployee(presentCounter+absentCounter+lateCounter);
  }

  const filterData = (tribe: string, report: string) => {
    // First filter by tribe
    let filteredByTribe = tribe === 'All' ? dailyData : dailyData.filter((daily) => daily.group === tribe);
    setFilteredData(filteredByTribe);
    setCardData(filteredByTribe);
    
  };
  useEffect(() => {
    if (dailyData.length > 0) {
      setData(selectedTribe, date);
      filterData(selectedTribe, date); // Apply tribe and date filters after data is fetched
    }
  }, [dailyData, selectedTribe, date]);

  useEffect(() => {
    setCardData(filteredData);
  }, [filteredData]);

  return (
    <>
      <div className='mb-4 font-satoshi'>
        <section className='lg:flex justify-between items-center gap-4'>
          <div className='lg:flex gap-4 my-2 lg:my-0'>
            <div className='flex items-center gap-4 mb-2 lg:mb-0'>
              <h2 className='text-black-0 font-semibold'>Tribe:</h2>
              <select 
                id="tribe-select"
                value={selectedTribe}
                onChange={handleTribeChange}
                className='px-2 py-3 border bg-white rounded-md text-black-0 max-w-64 md:max-w-full dark:border-strokedark dark:text-white dark:bg-boxdark border-stroke border-b'>
                <option value="All">All</option>
                {tribes.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex items-center gap-4'>
              <h2 className='text-black-0 font-semibold'>Time:</h2>
              <Datepicker options={options} onChange={handleChange} show={show} setShow={handleClose} />
            </div>
          </div>
          
          <DownloadButton date={date}/>
        </section>
        
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Presence Total" total={String(presentCount)} rate={String(((presentCount)*100/totalEmployee).toFixed(2))+"%"} >
        <svg
            className="fill-blueeazy dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Late Total" total={String(lateCount)} rate={String(((lateCount)*100/totalEmployee).toFixed(2))+"%"} >
        <svg
            className="fill-blueeazy dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Absence Total" total={String(absentCount)} rate={String(((absentCount)*100/totalEmployee).toFixed(2))+"%"} >
        <svg
            className="fill-blueeazy dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Employee Total" total={String(totalEmployee)} rate=''>
          <svg
            className="fill-blueeazy dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* <ChartOne /> */}
        {/* <ChartSum 
          period='Daily'
          tribe={selectedTribe}
        />
        <ChartTwo /> */}
        <ChartThree 
          present={presentCount}
          late={lateCount}
          absent={absentCount}
          total={totalEmployee}
          tribe={selectedTribe}
          />
        <ChartFour 
          period={date}
        />

        <div className="col-span-12 xl:col-span-8">
          <TableFixedDate date={date} />
        </div>
        <ChatCard />
        <ToastContainer />
      </div>
    </>
  );
};

export default ECommerce;
