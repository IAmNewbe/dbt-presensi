import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // const token = localStorage.getItem('token');
    if (!token) {
        // toast.error('Token not found', { position: toast.POSITION.TOP_CENTER, autoClose: false })
        // window.location.reload();
        setTimeout(() => navigate('/'), 5000);
    }
    setIsAuthenticated(!!token); // Convert token to boolean
    setLoading(false); // Stop loading after checking
  }, [token]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); 

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ToastContainer />
      {isAuthenticated ? (
        <DefaultLayout>
          <Routes>
            <Route
              index
              path="/"
              element={
                <>
                  <PageTitle title="Summary | Attendance Dashboard" />
                  <ECommerce />
                </>
              }
            />
            <Route
              path="/calendar"
              element={
                <>
                  <PageTitle title="Calendar | Attendance Dashboard" />
                  <Calendar />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <PageTitle title="Profile | Attendance Dashboard" />
                  <Profile />
                </>
              }
            />
            <Route
              path="/forms/form-elements"
              element={
                <>
                  <PageTitle title="Form Elements | Attendance Dashboard" />
                  <FormElements />
                </>
              }
            />
            <Route
              path="/forms/form-layout"
              element={
                <>
                  <PageTitle title="Form Layout | Attendance Dashboard" />
                  <FormLayout />
                </>
              }
            />
            <Route
              path="/tables"
              element={
                <>
                  <PageTitle title="Tables | Attendance Dashboard" />
                  <Tables />
                </>
              }
            />
            <Route
              path="/settings"
              element={
                <>
                  <PageTitle title="Settings | Attendance Dashboard" />
                  <Settings />
                </>
              }
            />
            <Route
              path="/chart"
              element={
                <>
                  <PageTitle title="Basic Chart | Attendance Dashboard" />
                  <Chart />
                </>
              }
            />
            <Route
              path="/ui/alerts"
              element={
                <>
                  <PageTitle title="Alerts | Attendance Dashboard" />
                  <Alerts />
                </>
              }
            />
            <Route
              path="/ui/buttons"
              element={
                <>
                  <PageTitle title="Buttons | Attendance Dashboard" />
                  <Buttons />
                </>
              }
            />
            <Route
              path="/auth/signup"
              element={
                <>
                  <PageTitle title="Signup | Attendance Dashboard" />
                  <SignUp />
                </>
              }
            />
          </Routes>
        </DefaultLayout>
      ) : (
        <SignIn />
      )}
    </>
  );
}

export default App;
