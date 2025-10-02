import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import './Layout.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const authenticated = isAuthenticated();

  // Check if current page should show navigation
  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname);
  const showNavigation = authenticated && !isAuthPage;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!showNavigation) {
    return (
      <div className="app-layout">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="main-content full-width">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header onToggleSidebar={toggleSidebar} />
      
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar />
      )}
      
      {/* Mobile Sidebar Overlay */}
      {isMobile && (
        <>
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={closeSidebar}
            isMobile={true}
          />
          {isSidebarOpen && (
            <div 
              className="sidebar-overlay"
              onClick={closeSidebar}
            />
          )}
        </>
      )}
      
      <main className={`main-content ${!isMobile ? 'with-sidebar' : ''} ${isMobile ? 'with-bottom-nav' : ''}`}>
        {children}
      </main>
      
      {/* Mobile Bottom Navigation */}
      {isMobile && <BottomNav />}
    </div>
  );
};

export default Layout;
