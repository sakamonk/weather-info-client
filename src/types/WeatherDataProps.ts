interface ForecastDataProps {
  date: string;
  dt_time_difference_text: string;
  dt_time_text: string;
  dt_date_text: string;
  temperature: number;
  temperature_feels_like: string;
  description: string;
  humidity: number;
  humidity_text: string;
  pressure: string;
  pressure_grndl_level: string;
  rain_probability_text: string;
  cloudiness: string;
  wind_direction: number;
  wind_gusts: string;
  wind_speed: string;
}

interface ForecastIcons {
  night: string[];
  day: string[];
}

interface WeatherDataProps {
  currentWeather: JSON;
  forecastWeather: ForecastDataProps[];
  icons?: ForecastIcons;
  list?: Array<{query: string}>;
  city_name: string;
  city_coords: {
    lat: number;
    lon: number;
  }
}

export type { ForecastIcons, WeatherDataProps };
