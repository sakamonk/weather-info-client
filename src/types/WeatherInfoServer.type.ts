interface WeatherInfoServerData {
  list: Array<{
    dt: number;
    weather: Array<{
      main: string;
      description: string;
    }>,
    main: {
      temp: number;
      feels_like: number;
      pressure: number;
      grnd_level: number;
      humidity: number;
    },
    clouds: {
      all: number;
    },
    wind: {
      speed: number;
      deg: number;
      gust: number;
    },
    visibility: number;
    pop: number;
    rain: {
      '3h': number;
    },
    snow: {
      '3h': number;
    },
    sys: {
      pod: string;
    }
  }>;
  city: {
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  }
  icons: {
    night: string[];
    day: string[];
  };
};

interface ExtractedForecastData {
//  list: Array<{
    dt: number;
    weather: Array<{
      main: string;
      description: string;
    }>,
    main: {
      temp: number;
      feels_like: number;
      pressure: number;
      grnd_level: number;
      humidity: number;
    },
    clouds: {
      all: number;
    },
    wind: {
      speed: number;
      deg: number;
      gust: number;
    },
    visibility: number;
    pop: number;
    rain: {
      '3h': number;
    },
    snow: {
      '3h': number;
    },
    sys: {
      pod: string;
    }
//  }>;
}

interface HumanReadableForecastData {
  dt: number;
  dt_text: string;
  dt_date_text: string;
  dt_time_text: string;
  dt_time_difference_text: string;
  main: string;
  description: string;
  temperature: string;
  temperature_feels_like: string;
  pressure: string;
  pressure_grndl_level: string;
  humidity: number,
  humidity_text: string;
  cloudiness: string;
  wind_speed: string;
  wind_direction: number;
  wind_gusts: string;
  visibility: string;
  rain_probability: number;
  rain_probability_text: string;
  rain_last_3h: string;
  snow_last_3h: string;
  part_of_the_day: string;
}

export type { WeatherInfoServerData, ExtractedForecastData, HumanReadableForecastData };
