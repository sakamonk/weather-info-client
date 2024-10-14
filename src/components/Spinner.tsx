/* Spinner to be dispayed on loading */
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-8 h-8 border-4 border-red-200 border-t-transparent rounded-full animate-spin dark:border-gray-400 dark:border-t-transparent"></div>
    </div>
  );
};

export { Spinner };
