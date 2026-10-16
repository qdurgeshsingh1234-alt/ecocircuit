import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Guide from './pages/Guide';
import Centers from './pages/Centers';
import Pickup from './pages/Pickup';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/centers" element={<Centers />} />
        <Route path="/pickup" element={<Pickup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
