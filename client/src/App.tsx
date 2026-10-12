import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { AboutPage } from './pages/AboutPage';
import { ReservationPage } from './pages/ReservationPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Handle browser back and forward navigation
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine active view
  const renderCurrentPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage navigate={navigate} />;
    }
    if (currentPath === '/menu') {
      return <MenuPage navigate={navigate} />;
    }
    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} />;
    }
    if (currentPath === '/reservations') {
      return <ReservationPage navigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage navigate={navigate} />;
    }
    if (currentPath === '/admin/login') {
      return <AdminLoginPage navigate={navigate} />;
    }
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      return <AdminDashboardPage navigate={navigate} />;
    }

    // 404 Fallback
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto px-4">
        <h1 className="font-serif text-4xl font-bold text-[#261611]">Page Not Found</h1>
        <p className="text-sm text-[#52352B]">
          The page you requested might have been relocated or does not exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-full bg-[#261611] text-[#FAF7F2] text-xs font-semibold hover:bg-[#38221B]"
        >
          Return to Café Home
        </button>
      </div>
    );
  };

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#261611]">
          <Navbar currentPath={currentPath} navigate={navigate} />
          <main className="flex-1">
            {renderCurrentPage()}
          </main>
          <Footer navigate={navigate} />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
