import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Guide from './pages/Guide';
import Centers from './pages/Centers';
import Pickup from './pages/Pickup';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { Waves } from './components/ui/wave-background';

function GlobalBackground() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <Waves
      backgroundColor={isHome ? '#14170F' : '#EFECE2'}
      className="fixed inset-0 z-0 pointer-events-none"
      strokeColor={isHome ? 'rgba(181, 101, 45, 0.22)' : 'rgba(181, 101, 45, 0.17)'}
      variant={isHome ? 'dark' : 'light'}
    />
  );
}

export default function App() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <BrowserRouter>
      <GlobalBackground />
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
