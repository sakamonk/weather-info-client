/* Page indicator component to navigate between pages and indicate the current page */

import { useNavigate } from "react-router-dom";
import { PageIndicatorProps } from "../types/PageIndicator.type";

const PageIndicator = ({ currentPage, totalPages }: PageIndicatorProps) => {
  const navigate = useNavigate();

  // navigate to the selected page when the dot is clicked
  const handleDotClick = (pageIndex: number) => {
    const route = pageIndex === 0 ? "/" : `/page${pageIndex + 1}`;
    navigate(route);
  };

  return (
    <div className="flex justify-center items-center page-indicator-row fixed bottom-5 left-0 right-0 z-40">
      {[...Array(totalPages)].map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 mx-2 rounded-full cursor-pointer transition-all duration-300 page-${index + 1}-indicator ${
            index === currentPage
              ? "active bg-gray-700 dark:bg-purple-900"
              : "bg-gray-300 dark:bg-gray-700"
          }`}
          onClick={() => handleDotClick(index)}
        />
      ))}
    </div>
  );
};

export default PageIndicator;
