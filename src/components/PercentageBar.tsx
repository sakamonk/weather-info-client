/* Display a percentage bar that animates from <startAt>% to <ceaseAt>% */

import React, { useEffect, useState } from 'react';
import { PercentageBarProps } from '../types/PercentageBarProps';

const PercentageBar: React.FC<PercentageBarProps> = ({ startAt = 0, ceaseAt = 100, scales = [] }) => {
  const [progress, setProgress] = useState(startAt);

  // Simulate the progress animation
  useEffect(() => {
    const timer = setTimeout(() => setProgress(ceaseAt), 500);
    return () => clearTimeout(timer);
  }, [ceaseAt]);

  return (
    <div className="self-stretch text-gray-250 text-xs space-y-1">
      <div className="flex justify-between space-x-5 items-center px-1">
        {scales.map((scale) => (
          <p key={scale}>{scale}</p>
        ))}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
        <div
          className="bg-gray-500 dark:bg-purple-900 h-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export { PercentageBar };
