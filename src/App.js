import './App.css';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Department from './components/pages/Department/Department';
import Major from './components/pages/Major/Major';
import {
  BrowserRouter,
  Switch,
  Route,
  Routes,
  Link,
  useRouteMatch,
  Outlet
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Header title="Title" />
      <Sidebar>
        
      </Sidebar>
    

    
      <div id='main-content'>
      <Routes>

          <Route path='/department' element={<Department></Department>} />
          <Route path="/major" element={<Major></Major>} />

      </Routes>

      
      </div>
    </div>
  );
}

export default App;

