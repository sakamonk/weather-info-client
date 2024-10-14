import React from "react";
import { useMediaQuery } from "react-responsive";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../components/AppContext";
import { ExtractForecast } from "../utils/ExtractForecast";
import DraggableCardManager from "../components/DraggableCardManager";

const Page6: React.FC = () => {
  const { weatherData, selectedUnit } = useAppContext();
  const { t } = useTranslation();

  console.log('weatherData', JSON.stringify(weatherData));

  const forecastDayNumber = 6;
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1025px)' });
  const maxNumberOfForecasts = isLargeScreen ? 6 : 4;
  const dateFormat = t('date_format');
  const timeFormat = t('time_format');
  const dateTimeFormat = t('date_time_format');

  const forecast = ExtractForecast(weatherData.forecastWeather, 
                                   forecastDayNumber,
                                   selectedUnit,
                                   dateTimeFormat, 
                                   dateFormat,
                                   timeFormat,
                                   maxNumberOfForecasts);

  if (!forecast) {
    return <div></div>
  }

  return <DraggableCardManager weatherData={forecast} />
};

export default Page6;
