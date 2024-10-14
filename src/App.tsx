import React from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import Layout from "./components/MainLayout";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";
import Page4 from "./pages/Page4";
import Page5 from "./pages/Page5";
import Page6 from "./pages/Page6";
import PageIndicator from "./components/PageIndicator";
import '../i18n.config';

const totalPages = 6;

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current page number based on the URL path
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/") return 0;
    const match = path.match(/\/page(\d+)/);
    if (!match) return 0;
    return parseInt(match[1], 10) - 1;
  };

  const currentPage = getCurrentPage();

  // Use swiping gestures to navigate between pages. Mouse swiping is enabled for desktop users.
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handlePageChange("next"),
    onSwipedRight: () => handlePageChange("previous"),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // Handle page navigation based on swipe direction
  const handlePageChange = (direction: string) => {
    let changePath = "";

    if (direction === "next" && currentPage < totalPages - 1) {
      changePath = currentPage === 0 ? "/page2" : `/page${currentPage + 2}`;
    } else if (direction === "previous" && currentPage > 0) {
      changePath = currentPage === 1 ? "/" : `/page${currentPage}`;
    }

    if (changePath !== "") {
      navigate(changePath);
    }
  };

  return (
    <div {...swipeHandlers}>
      <Layout>
        <Routes>
          <Route path="/" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/page3" element={<Page3 />} />
          <Route path="/page4" element={<Page4 />} />
          <Route path="/page5" element={<Page5 />} />
          <Route path="/page6" element={<Page6 />} />
        </Routes>
      </Layout>

      <PageIndicator currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default App;
