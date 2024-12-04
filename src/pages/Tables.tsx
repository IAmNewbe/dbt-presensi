import { useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableAll from '../components/Tables/TableAll';
import TableOne from '../components/Tables/TableOne';
import TableThree from '../components/Tables/TableThree';
import TableTwo from '../components/Tables/TableTwo';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Tables = () => {
  const navigate = useNavigate();
  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error(`Session time out, please log in again`, { position: toast.POSITION.TOP_CENTER, autoClose: false });
      navigate('/');
      window.location.reload();
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
     checkToken();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableAll />
        <TableTwo />
        {/* <TableThree /> */}
      </div>
      <ToastContainer />
    </>
  );
};

export default Tables;
