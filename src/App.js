import './App.css';
import Sidebar from './components/common/Sidebar';
import HeaderDefault from './components/common/HeaderDefault';
import Department from './components/pages/Department/Department';
import Major from './components/pages/Major/Major';
import Login from './components/pages/Login/Login';
import Subject from "./components/pages/Subject/Subject";
import ChargePerson from './components/pages/User/ChargePerson/ChargePerson';
import Lecturer from './components/pages/User/Lecturer/Lecturer';
import Student from './components/pages/User/Student/Student';
import TopicList from './components/pages/TopicManagement/Teacher/TopicList/TopicList';
import TopicRegistration from './components/pages/TopicManagement/Teacher/TopicRegistration/TopicRegistration';
import ApprovedTopicList from './components/pages/TopicManagement/Teacher/ApprovedTopicList/ApprovedTopicList';
import ProposedTopicList from './components/pages/TopicManagement/Teacher/ProposedTopicList/ProposedTopicList';
import TopicRegistrationProposed from './components/pages/TopicManagement/Student/TopicRegistrationProposed/TopicRegistrationProposed';
import {
  Route,
  Routes,
} from "react-router-dom";
import AuthContext from './context/authContext';
import NotificationContext from './context/notificationContext';
import useAuth from './hooks/useSupabase/useAuth'
import { notification, Layout } from 'antd';
import './styles/app.scss';
const { Content } = Layout;
function App() {
  const { user, login, logout, isAdmin, isTeacher, fetched: fetchedAuth } = useAuth();
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
        <AuthContext.Provider value={{ user, login, logout, isAdmin, isTeacher }}>
          <Login />
          {notificationHolder}
        </AuthContext.Provider>
      </NotificationContext.Provider>
    )
  }
  return (
    <NotificationContext.Provider value={{ openNotification }}>
      <AuthContext.Provider value={{ user, login, logout, isAdmin, isTeacher }}>
        <Layout>
          <HeaderDefault title="Title" />
          <Layout id='main-content'>
            <Sidebar />
            <Layout>
              <Content className='content'>
                <div className="router-wrapper mt-4 mx-3 text-center">
                  <Routes >
                    <Route path='/department' element={<Department />} />
                    <Route path="/major" element={<Major />} />
                    <Route path="/graduate-charge-person" element={<ChargePerson />} />
                    <Route path="/subject" element={<Subject />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/lecturer" element={<Lecturer />} />
                    <Route path="/student" element={<Student />} />
                    <Route path="/teacher-topic-registration" element={<TopicRegistration />} />
                    <Route path="/topic-list" element={<TopicList />} />
                    <Route path="/approved-topic-list" element={<ApprovedTopicList />} />
                    <Route path="/proposed-topic-list" element={<ProposedTopicList />} />
                    <Route path="/student-topic-registration" element={<TopicRegistrationProposed />} />
                  </Routes>
                </div>
              </Content>
            </Layout>
          </Layout>
        </Layout>
        {notificationHolder}
      </AuthContext.Provider>
    </NotificationContext.Provider>
  );
}

export default App;

