/* Display a compass needle that rotates to a specific angle */

import React, { useEffect, useState } from 'react';
import { IoArrowUp } from 'react-icons/io5';
import { CompassNeedleProps } from '../types/CompassNeedleProps';

const CompassNeedle: React.FC<CompassNeedleProps> = ({ startAt = 0, direction, showCardinals = false }) => {
  const [rotation, setRotation] = useState(startAt);

  // Simulate the rotation animation
  useEffect(() => {
    const timer = setTimeout(() => setRotation(direction), 500);
    return () => clearTimeout(timer);
  }, [direction]);

  return (
    <div className="flex relative">
      <div className="border-4 border-gray-400 dark:border-gray-700 rounded-full p-2 relative xs:border-2 xs:p-1">
        <div
          className="transform transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <IoArrowUp className="text-4xl sm:text-2xl xs:text-xl" />
        </div>
      </div>

      {showCardinals && (
        <div>
          <div className="absolute top-0 left-1/2 transform -translate-y-[100%] translate-x-[105%]">N</div>
          <div className="absolute bottom-0 left-1/2 transform translate-y-[100%] translate-x-[105%]">S</div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-[125%]">W</div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-[475%]">E</div>
        </div>
      )}
    </div>
  );
};

export { CompassNeedle };
