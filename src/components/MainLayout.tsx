/* Layout to be used in the application. It contains the sidebar and the main content area. */

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import WeatherLocation from "./WeatherLocation";
import { AlertPopup } from "./AlertPopup";
import { useAppContext } from "./AppContext";

const Layout: React.FC = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth < 640);

  const { alertPopup, hideAlertPopup } = useAppContext();

  useEffect(() => {
    const handleWindowResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative h-screen flex">
      <WeatherLocation isSidebarOpen={isSidebarOpen} isSmallScreen={isSmallScreen} />
      <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

      <div className="flex-1 bg-gray-400 dark:bg-slate-800 text-gray-900 dark:text-gray-400">
        {children}
      </div>

      {/* Global alert popup */}
      <AlertPopup
        isOpen={alertPopup.isOpen}
        title={alertPopup.title}
        message={alertPopup.message}
        autoCloseTime={alertPopup.autoCloseTime}
        onClose={hideAlertPopup}
      />

    </div>
  );
};

export default Layout;
