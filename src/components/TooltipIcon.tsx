import React, { useState, useEffect, useRef } from 'react';
import { IoInformationCircle } from "react-icons/io5";

const TooltipIcon: React.FC<{ text: string }> = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState('left-1/2 transform -translate-x-1/2'); // Default center position
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Adjust position if the tooltip overflows on the right side of the viewport
      if (tooltipRect.right > viewportWidth) {
        setTooltipPosition('right-0 transform translate-x-0'); // Align tooltip to the left if it overflows right
      } else if (tooltipRect.left < 0) {
        setTooltipPosition('left-0 transform translate-x-0'); // Align tooltip to the right if it overflows left
      } else {
        setTooltipPosition('left-1/2 transform -translate-x-1/2'); // Default center position
      }
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-pointer text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
      >
        <IoInformationCircle className="text-lg text-gray-300" /> {/* Icon for the tooltip */}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute bottom-full ${tooltipPosition} mb-2 px-2 py-1 bg-gray-700 text-white text-xs md:text-lg rounded shadow-lg whitespace-nowrap z-50`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default TooltipIcon;
