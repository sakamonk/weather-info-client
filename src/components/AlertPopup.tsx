/* Popup to display error messages */
import React, { useEffect } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { AlertPopupProps } from '../types/AlertPopupProps';

const AlertPopup: React.FC<AlertPopupProps> = ({ isOpen, title, message, onClose, autoCloseTime }) => {

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Close the popup automatically after a certain time if autoCloseTime is provided
    if (isOpen && autoCloseTime) {
      timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
    }

    // Clear the timer when the component is unmounted
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, autoCloseTime, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <div className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 dark:bg-purple-900 text-white dark:text-gray-400 rounded-full p-2 hover:bg-red-600 focus:outline-none"
        >
          <IoCloseSharp />
        </button>
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
      </div>
    </div>
  );
};

export { AlertPopup };
