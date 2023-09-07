import './App.css';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Department from './components/pages/Department/Department';
import Major from './components/pages/Major/Major';
import Lecturer from './components/pages/Lecturer/Lecturer';
import Subject from "./components/pages/Subject/Subject";

import {
  Route,
  Routes,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Header title="Title" />



      <div id='main-content'>
        <Sidebar />
        <div className='content'>
          <div className="router-wrapper mt-4">
          <Routes >
            <Route path='/department' element={<Department/>} />
            <Route path="/major" element={<Major/>} />
            <Route path="/lecturer" element={<Lecturer/>} />
            <Route path="/subject" element={<Subject/>} />
          </Routes>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

