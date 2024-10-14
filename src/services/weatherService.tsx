/* Service to fetch weather data from the Weather Info Server */

import { languageStorageKey, unitStorageKey } from "../utils/StorageKeys";

const apiServerHost = `${import.meta.env.VITE_SERVER_HOST || "http://localhost"}:${import.meta.env.VITE_SERVER_PORT || 3500}`;
const currentWeatherEndpoint = `${apiServerHost}/${import.meta.env.VITE_CURRENT_WEATHER_API_ENDPOINT}`;
const forecastWeatherEndpoint = `${apiServerHost}/${import.meta.env.VITE_FORECAST_API_ENDPOINT}`;

interface WeatherData {
  data: JSON;
}

// Get the saved API settings from localStorage
const getOptions = () => {
  const language =
    localStorage.getItem(languageStorageKey) ||
    import.meta.env.VITE_DEFAULT_API_LANG ||
    "en";
  const unit =
    localStorage.getItem(unitStorageKey) ||
    import.meta.env.VITE_DEFAULT_API_UNIT ||
    "metric";

  return {
    lang: language,
    unit: unit,
  };
};

// Fetch the current weather data from the server by coordinate location
export const getWeatherByCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<WeatherData | null> => {
  try {
    const opts = getOptions();

    const response = await fetch(
      `${currentWeatherEndpoint}?lat=${latitude}&lon=${longitude}&unit=${opts.unit}&lang=${opts.lang}`,
    );

    if (!response.ok) {
      throw new Error(`Error fetching weather data by coordinates: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching weather data by coords:", error);
    return null;
  }
};

// Fetch the weather forecast data from the server by coordinate location
export const getForecastByCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<WeatherData | null> => {
  try {
    const opts = getOptions();

    const response = await fetch(
      `${forecastWeatherEndpoint}?lat=${latitude}&lon=${longitude}&unit=${opts.unit}&lang=${opts.lang}`,
    );

    if (!response.ok) {
      throw new Error(`Error fetching forecast data by coordinates: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching forecast data by coords:", error);
    return null;
  }
};

// Fetch the current weather data from the server by location name
export const getWeatherByLocationName = async (
  city: string,
): Promise<WeatherData | null> => {
  try {
    const opts = getOptions();

    const response = await fetch(
      `${currentWeatherEndpoint}?city=${city}&unit=${opts.unit}&lang=${opts.lang}`,
    );

    if (!response.ok) {
      throw new Error(`Error fetching weather data by location name: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching weather data by location name:", error);
    return null;
  }
};

// Fetch the weather forecast data from the server by location name
export const getForecastByLocationName = async (
  city: string,
): Promise<WeatherData | null> => {
  try {
    const opts = getOptions();

    const response = await fetch(
      `${forecastWeatherEndpoint}?city=${city}&unit=${opts.unit}&lang=${opts.lang}`,
    );

    if (!response.ok) {
      throw new Error(`Error fetching forecast data by location name: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching forecast data by location name:", error);
    return null;
  }
};
