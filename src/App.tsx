import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Layout from './components/common/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* not found page */}
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;