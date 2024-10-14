import { ReactNode } from "react";
import { WeatherDataProps } from "./WeatherDataProps";
import { AlertPopupProps } from "./AlertPopupProps";

interface AppContextProps {
  weatherData: WeatherDataProps;
  loading: boolean;
  weatherError: string | null;
  setWeatherError: (error: string | null) => void;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  handleSearchByLocation: () => void;
  handleSearchByName: (city: string) => void;
  repeatSearch: () => void;
  alertPopup: AlertPopupProps;
  showAlertPopup: (title: string, message: string, autoCloseTime?: number) => void;
  hideAlertPopup: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  selectedUnit: string;
  setSelectedUnit: (unit: string) => void;
}

interface AppContextProviderProps {
  children: ReactNode;
}

export type { AppContextProps, AppContextProviderProps };
