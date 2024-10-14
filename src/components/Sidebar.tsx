/* Sidebar component that contains the settings for the application. */

import React, { useEffect } from "react";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import { TERipple } from "tw-elements-react";
import {
  languageStorageKey,
  unitStorageKey,
  themeStorageKey,
} from "../utils/StorageKeys";
import { useAppContext } from "./AppContext";
import languageOptions from "../utils/LanguageOptions";
import unitOptions from "../utils/UnitOptions";
import themeOptions from "../utils/ThemeOptions";
import i18n from 'i18next';
import TooltipIcon from "./TooltipIcon";


const Sidebar: React.FC<{ isOpen: boolean, onToggle: () => void }> = ({ isOpen, onToggle }) => {
  const { showAlertPopup,
          repeatSearch,
          theme, setTheme,
          selectedLanguage, setSelectedLanguage,
          selectedUnit, setSelectedUnit,
        } = useAppContext();

  const toggleSidebar = () => {
    onToggle();
  };

  // Retrieve the saved settings from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem(languageStorageKey);
    const savedUnit = localStorage.getItem(unitStorageKey);
    const savedTheme = localStorage.getItem(themeStorageKey);

    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }

    if (savedUnit) {
      setSelectedUnit(savedUnit);
    }

    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, [showAlertPopup]);

  // Apply the selected theme to the application
  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem(themeStorageKey, "dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
      localStorage.setItem(themeStorageKey, "light");
    } else {
      // following the OS preference
      root.classList.remove("dark");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      }
      localStorage.setItem(themeStorageKey, "system");
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTheme(value);
    showAlertPopup("Theme Changed", `Theme changed to ${value}.`);
    applyTheme(value);
  };

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLanguage(value);
    localStorage.setItem(languageStorageKey, value);
    i18n.changeLanguage(value);
    showAlertPopup("Language Changed", `Language changed to ${value}.`);
    await repeatSearch();
  };

  const handleUnitChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedUnit(value);
    localStorage.setItem(unitStorageKey, value);
    showAlertPopup("Unit Changed", `Unit changed to ${value}.`);
    await repeatSearch();
  };

  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return (
    <div className="relative h-screen flex z-50">
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-fuchsia-800 dark:bg-gray-900 text-white dark:text-gray-400 p-6 rounded-l-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-xl font-bold">General Settings</h2>

        {/* Theme selection as a button group */}
        <div className="mt-8 mb-4">
          <h3 className="mb-2">Select Theme:</h3>
          <div className="flex justify-between">
            {themeOptions.map((option, index) => (
              <TERipple key={option} rippleDuration={500}>
                <label
                  className={`${index < themeOptions.length - 1 ? "mr-1" : ""}`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={option}
                    checked={theme === option}
                    onChange={handleThemeChange}
                    className="hidden"
                  />
                  <span
                    className={`cursor-pointer px-4 py-2 rounded ${
                      theme === option
                        ? "bg-blue-600 dark:bg-blue-800 text-white"
                        : "bg-gray-200 dark:bg-gray-300 text-gray-800"
                    }`}
                  >
                    {capitalize(option)}
                  </span>
                </label>
              </TERipple>
            ))}
          </div>
        </div>

        <hr className="mt-8 mb-5 my-4 bg-neutral-100 dark:bg-white/10" />

        <h2 className="text-xl font-bold">Weather API Settings</h2>

        {/* Language selection as a dropdown box */}
        <div className="mt-8 mb-4">
          <label htmlFor="languageDropdown" className="block mb-2">
            Select a Language:
          </label>

          <select
            id="languageDropdown"
            className="w-full p-2 text-gray-700 dark:bg-gray-300"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {/* Map through languageOptions to render <option> elements */}
            {languageOptions.map(([code, name], index) => (
              <option key={index} value={code}>
                {name} ({code.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Unit selection as a radio button group */}
        <div className="mt-8 mb-4">
          <h3 className="mb-2">Select a Unit:</h3>
          <div className="flex flex-col items-center justify-center">
            {unitOptions.map((option) => (
              <TERipple
                key={option}
                className="mb-2 w-full"
                rippleDuration={500}
              >
                <label className="mb-2 w-full">
                  <input
                    type="radio"
                    name="unit"
                    value={option}
                    checked={selectedUnit === option}
                    onChange={handleUnitChange}
                    className="hidden"
                  />

                  <span
                    className={`block w-full text-center cursor-pointer px-4 py-2 rounded ${
                      selectedUnit === option
                        ? "bg-blue-600 dark:bg-blue-800 text-white"
                        : "bg-gray-200 dark:bg-gray-300 text-gray-800"
                    }`}
                  >
                    {capitalize(option)}
                  </span>
                </label>
              </TERipple>
            ))}
          </div>
        </div>

        <div className="block sm:hidden">
          <hr className="mt-8 mb-5 my-4 bg-neutral-100 dark:bg-white/10" />
          <div className="relative group flex ">
            <h2 className="text-xl font-bold space-x-2">
              Forecast Order
            </h2>
            <span className="pl-2 left-0 text-gray-500 dark:text-gray-300 cursor-pointer">
              <TooltipIcon text="Drag and drop to reorder the forecast cards." />
            </span>
          </div>
        </div>
      </div>

      {/* Double-Headed Arrow Icon for Toggling Sidebar */}
      <button
        className={`fixed pt-2 z-50 text-3xl text-gray-700 dark:text-purple-900 cursor-pointer transition-transform duration-400 ${
          isOpen ? "right-[15rem]" : "right-4"
        }`}
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <BiChevronsRight className="transition-transform duration-600" />
        ) : (
          <BiChevronsLeft className="transition-transform duration-600" />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
