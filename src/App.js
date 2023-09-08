import './App.css';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Department from './components/pages/Department/Department';
import Major from './components/pages/Major/Major';
import Lecturer from './components/pages/Lecturer/Lecturer';
import Subject from "./components/pages/Subject/Subject";

import Login from './components/pages/Login/Login';
import {
  Route,
  Routes,
} from "react-router-dom";
import AuthContext from './context/authContext';
import NotificationContext from './context/notificationContext';
import useAuth from './hooks/useSupabase/useAuth'
import { notification } from 'antd';

function App() {
  const { user, login, logout, isAdmin, fetched: fetchedAuth } = useAuth();
  const [notificationApi, notificationHolder] = notification.useNotification();
  const openNotification = ({
    type = 'success',
    message = 'Notfication',
    description = '',
    duration
  }) => {
    notificationApi[type]({ message, description, duration });
  };
  if (!fetchedAuth.fetched) {
    return <>Loading</>
  }
  if (!fetchedAuth.hasSession) {
    return (
      <NotificationContext.Provider value={{ openNotification }}>
        <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
          <Login />
          {notificationHolder}
        </AuthContext.Provider>
      </NotificationContext.Provider>
    )
  }
  return (
    <NotificationContext.Provider value={{ openNotification }}>
      <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
        <div className="App">
          <Header title="Title" />
          <div id='main-content'>
            <Sidebar />
            <div className='content'>
              <div className="router-wrapper mt-4">
                <Routes >
                  <Route path='/department' element={<Department></Department>} />
                  <Route path="/major" element={<Major></Major>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/lecturer" element={<Lecturer />} />
                  <Route path="/subject" element={<Subject />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
        {notificationHolder}
      </AuthContext.Provider>
    </NotificationContext.Provider>
  );
}

export default App;

