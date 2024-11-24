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

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === undefined) {
        window.location.reload();
    }
    console.log(token);
    setIsAuthenticated(!!token); // Convert token to boolean
    setLoading(false); // Stop loading after checking
    console.log(isAuthenticated);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return isAuthenticated ? (
    <DefaultLayout>
      <Routes>
        {/* <Route
          index
          element={
            <>
              <PageTitle title="Signin | Attendace Dashboard" />
              <SignIn />
            </>
          }
        /> */}
        <Route
          index
          path="/"
          element={
            <>
              <PageTitle title="Summary | Attendace Dashboard" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | Attendace Dashboard" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | Attendace Dashboard" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | Attendace Dashboard" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | Attendace Dashboard" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | Attendace Dashboard" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | Attendace Dashboard" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | Attendace Dashboard" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | Attendace Dashboard" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | Attendace Dashboard" />
              <Buttons />
            </>
          }
        />
        {/* <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | Attendace Dashboard" />
              <SignIn />
            </>
          }
        /> */}
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | Attendace Dashboard" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  ) : 
    // <PageTitle title="Signin | Attendace Dashboard" />
    <SignIn />
  ;
}

export default App;
