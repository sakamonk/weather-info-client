/* Pass down the weather data to the children components using React Context API.
 * Weather data contains current weather and weather forecast, both in JSON format.
 */

import React, { createContext, useState, useContext } from "react";
import { AppContextProps, AppContextProviderProps } from "../types/AppContextProps";
import { WeatherDataProps } from "../types/WeatherDataProps";
import { getWeatherByCoordinates,
         getForecastByCoordinates,
         getForecastByLocationName,
         getWeatherByLocationName } from "../services/weatherService";
import { languageStorageKey,
         unitStorageKey,
        } from "../utils/StorageKeys";

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherDataProps>({
    currentWeather: JSON,
    forecastWeather: [],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Default values for language, unit, and theme
  const defaultApiLanguage = import.meta.env.VITE_DEFAULT_API_LANG || "en";
  const defaultApiUnit = import.meta.env.VITE_DEFAULT_API_UNIT || "metric";
  const defaultTheme = import.meta.env.VITE_DEFAULT_APP_THEME || "system";

  const loadApiLanguage = () => {
    const savedLanguage = localStorage.getItem(languageStorageKey);
    return savedLanguage || defaultApiLanguage;
  }

  const loadApiUnit = () => {
    const savedUnit = localStorage.getItem(unitStorageKey);
    return savedUnit || defaultApiUnit;
  }

  const loadTheme = () => {
    const savedTheme = localStorage.getItem(languageStorageKey);
    return savedTheme || defaultTheme;
  }

  const [selectedLanguage, setSelectedLanguage] = useState(loadApiLanguage);
  const [selectedUnit, setSelectedUnit] = useState(loadApiUnit);
  const [theme, setTheme] = useState<string>(loadTheme);

  // Alert popup state management
  const [alertPopup, setAlertPopup] = useState({
    isOpen: false,
    message: "",
    title: "",
    autoCloseTime: 3500,
    onClose: () => {},
  });

  const showAlertPopup = (title: string, message: string, autoCloseTime: number = 3500) => {
    setAlertPopup({
      isOpen: true,
      title,
      message,
      autoCloseTime,
      onClose: hideAlertPopup,
    });
  };

  const hideAlertPopup = () => {
    setAlertPopup({ ...alertPopup, isOpen: false });
  };

  const emptyWeatherData = async () => {
    setWeatherError(null);
    setWeatherData({
      currentWeather: JSON,
      forecastWeather: [],
    });
  };

  const updateCoordinates = async (latitude: number, longitude: number) => {
    setCity(null);
    setLatitude(latitude);
    setLongitude(longitude);
  };

  const updateCity = async (city: string) => {
    setCity(city);
    setLatitude(null);
    setLongitude(null);
  };

  // Search weather by coordinates
  const searchByLocation = async (latitude: number, longitude: number) => {
    await emptyWeatherData();
    await updateCoordinates(latitude, longitude);

    const currentWeatherData = await getWeatherByCoordinates(
      latitude,
      longitude
    );

    const forecastData = await getForecastByCoordinates(
      latitude,
      longitude
    );

    setWeatherData({
      currentWeather: currentWeatherData?.data || JSON.parse("{}"),
      forecastWeather: forecastData?.data || JSON.parse("{}"),
    });

    setLoading(false);
  };
  
  // Get coordinates by browser geolocation and handle the search
  const handleSearchByLocation = async () => {
    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await searchByLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation", error);
          setWeatherError("Error getting geolocation.");
          setLoading(false);
        }
      );
    } else {
      setWeatherError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
    
    if (weatherError) {
      showAlertPopup("Error", weatherError);
    }
  };

  // Search weather by city name
  const handleSearchByName = async (city: string) => {
    if (!city || city.trim() === "") {
      setWeatherError("Please enter a city name.");
      showAlertPopup("Error", weatherError || "");
      return;
    }
    
    setLoading(true);

    await emptyWeatherData();
    await updateCity(city);

    const currentWeatherData = await getWeatherByLocationName(city);
    const forecastData = await getForecastByLocationName(city);
 
    setWeatherData({
      currentWeather: currentWeatherData?.data || JSON.parse("{}"),
      forecastWeather: forecastData?.data || JSON.parse("{}"),
    });

    setLoading(false);
  };

  const repeatSearch = async () => {
    if (latitude && longitude) {
      await searchByLocation(latitude, longitude);
    } else if (city) {
      await handleSearchByName(city);
    }
  };

  return (
    <AppContext.Provider
      value={{
        weatherData,
        loading,
        weatherError,
        setWeatherError,
        city,
        latitude,
        longitude,
        handleSearchByLocation,
        handleSearchByName,
        alertPopup,
        showAlertPopup,
        hideAlertPopup,
        repeatSearch,
        theme,
        setTheme,
        selectedLanguage,
        setSelectedLanguage,
        selectedUnit,
        setSelectedUnit,
        }}
    >
      {children}
    </AppContext.Provider>
  );
};
