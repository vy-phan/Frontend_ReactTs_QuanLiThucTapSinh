import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { TaskDetail } from './pages/task-detail';
import Login from './pages/Login'; // Thêm import cho trang login
import Layout from './components/common/Layout';
import { Outlet } from 'react-router-dom';
import Task from './pages/Task';
import Intern from './pages/Intern';
import { useAuth } from './context/authContext';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Các route không có layout */}
        <Route path="/login" element={<Login />} />

        {/* Các route có layout */}
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="/" element={<Home />} />
          <Route path="/task" element={<Task />} />
          {user?.role === 'MANAGER' ? (
            <Route path="/intern" element={<Intern />} />
          ) : (
            <Route path="*" element={<NotFound />} />
          ) 
          }
          <Route path="/task_detail/:taskId" element={<TaskDetail />} />
        </Route>
        {/* Route not found - không có layout */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;