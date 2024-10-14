import React from "react";
import { useMediaQuery } from "react-responsive";
import { useAppContext } from "../components/AppContext";

import { startOfToday, endOfToday, addDays, getUnixTime } from "date-fns";
import { ExtractForecast } from "../utils/ExtractForecast";
import DraggableCardManager from "../components/DraggableCardManager";


const timestampsForPage = (page: number) => {
  const forecastDay = page - 1;
  const startOfForecast = addDays( startOfToday(), forecastDay );
  const endOfForecast = addDays( endOfToday(), forecastDay );
  const startOfForecastUnix = getUnixTime(startOfForecast);
  const endOfForecastUnix = getUnixTime(endOfForecast);
  return { startTs: startOfForecastUnix, endTs: endOfForecastUnix };
};

const ts0 = timestampsForPage(1)
const ts1 = timestampsForPage(2)
const ts2 = timestampsForPage(3)
const ts3 = timestampsForPage(4)
const ts4 = timestampsForPage(5)


const Page1: React.FC = () => {
  const { weatherData } = useAppContext();

//  if ( weatherData.forecastWeather ) {
    const forecast = ExtractForecast(weatherData.forecastWeather, 2, 'fi');
//  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl w-full text-center">This is Page 1</h1>
      <p>Shared Data: {JSON.stringify(weatherData)}</p>

      <p>Timestamps for today: {JSON.stringify(ts0)}</p>
      <p>Timestamps for today: {JSON.stringify(ts1)}</p>
      <p>Timestamps for today: {JSON.stringify(ts2)}</p>
      <p>Timestamps for today: {JSON.stringify(ts3)}</p>
      <p>Timestamps for today: {JSON.stringify(ts4)}</p>

      <p>Forecast: {JSON.stringify(forecast)}</p>

    </div>

  );
};

export default Page1;
