/* Component to trigger location search and input search */

import React, { useEffect, useState, useRef } from "react";
import { IoSearch, IoLocation, IoCheckmarkCircleSharp } from "react-icons/io5";
import { useAppContext } from "./AppContext";
import { Spinner } from "./Spinner";

const WeatherLocation: React.FC<{ isSidebarOpen: boolean, isSmallScreen: boolean }> = ({ isSidebarOpen, isSmallScreen }) => {
  const { handleSearchByLocation, handleSearchByName, setWeatherError, loading, showAlertPopup } = useAppContext();

  const [showInputTextBox, setShowInputTextBox] = useState(false);
  const inputTextBoxRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = () => {
    setShowInputTextBox(!showInputTextBox);
    if (showInputTextBox) {
      setWeatherError(null);
    }
  };

  // Close the search input box when the sidebar is opened and the screen is small
  useEffect(() => {
    if (isSidebarOpen && isSmallScreen && showInputTextBox) {
      setShowInputTextBox(false);
    }
  }, [isSidebarOpen, isSmallScreen, showInputTextBox]);
  
  useEffect(() => {
    if (showInputTextBox && inputTextBoxRef.current) {
      inputTextBoxRef.current.focus();
    }
  }, [showInputTextBox]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputValue = inputTextBoxRef.current?.value || "";
    if (!inputValue.trim()) {
      showAlertPopup("Error", "Please enter a valid city name.");
      return;
    }
    handleSearchByName(inputValue);
  };

  // Get location using browser geolocation if available
  const handleGetLocation = () => handleSearchByLocation();

  return (
    <div className="absolute top-2 left-2 xs:top-0 xs: left-4 z-50 text-gray-700 dark:text-gray-400">
      <div className="flex space-x-2">
        {/* Location icon */}
        <button
          onClick={handleGetLocation}
          className="flex flex-col text-2xl pt-2 focus:outline-none"
        >
          <IoLocation />
        </button>

        {/* Search icon */}
        <button
          onClick={handleSearchClick}
          className="flex flex-col text-2xl pt-2 focus:outline-none"
        >
          <IoSearch />
        </button>

        {/* City search input */}
        {showInputTextBox && (
          <form onSubmit={handleSearchSubmit} className="flex flex-col">
            <div className="relative">
              <input
                ref={inputTextBoxRef}
                type="text"
                placeholder="Enter a city"
                className="flex-col border-none p-1 pr-12 top-1/2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-0 dark:bg-gray-500 dark:text-gray-300"
              />

              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 dark:bg-gray-400 p-0.5 text-white dark:text-gray-350 rounded-md focus:outline-none hover:bg-blue-600"
              >
                <IoCheckmarkCircleSharp />
              </button>
            </div>
          </form>
        )}

        {loading && <Spinner />}
      </div>

    </div>
  );
};

export default WeatherLocation;
