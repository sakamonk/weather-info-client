import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ForecastCard } from "./ForecastCard";
import { CompassNeedle } from "./CompassNeedle";
import { PercentageBar } from "./PercentageBar";
import { forecastCardOrderKey } from "../utils/StorageKeys";
import { useAppContext } from "../components/AppContext";
import { DraggableCardManagerProps } from "../types/DraggableCardManagerProps";
import { Card } from "../types/Card.type";
import TooltipIcon from "./TooltipIcon";

const DraggableCardManager: React.FC<DraggableCardManagerProps> = ({ weatherData }) => {

  const { t } = useTranslation();
  const { theme } = useAppContext();

  // set initial card order
  const [cardOrder, setCardOrder] = useState<Card[]>([
    { id: "description" },
    { id: "temperature" },
    { id: "wind" },
    { id: "cloudiness" },
    { id: "pressure" },
    { id: "humidity" },
  ]);

  // get saved card order from local storage if it has been saved
  // load only once when the component is mounted
  useEffect(() => {
    const initialCardOrder = localStorage.getItem(forecastCardOrderKey);
    if (initialCardOrder) {
      setCardOrder(JSON.parse(initialCardOrder));
    }
  }, []);

  // save changed card order to local storage
  const saveCardOrderToLocalStorage = (newCardOrder: Card[]) => {
    localStorage.setItem(forecastCardOrderKey, JSON.stringify(newCardOrder));
  }

  // handle card drag and drop
  const handleDragStart = (event: React.DragEvent, cardId: string) => {
    event.dataTransfer.setData("cardId", cardId);
  };

  const handleDrop = (event: React.DragEvent, dropCardId: string) => {
    const dragCardId = event.dataTransfer.getData("cardId");

    // reordering logic
    const newCardOrder = [...cardOrder];
    const dragIndex = newCardOrder.findIndex((card) => card.id === dragCardId);
    const dropIndex = newCardOrder.findIndex((card) => card.id === dropCardId);

    const [draggedCard] = newCardOrder.splice(dragIndex, 1);
    newCardOrder.splice(dropIndex, 0, draggedCard);

    setCardOrder(newCardOrder);
    saveCardOrderToLocalStorage(newCardOrder);
  };

  // prevent default dragover behavior
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
  <div>
    <h2 className="text-xl font-semibold text-center pt-2">{weatherData.forecastWeather[0].dt_date_text}</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-3 lg:gap-2 xs:pt-4 justify-center">
      {weatherData.forecastWeather.map((forecast, index) => (
        <ForecastCard
          key={index}
          bgImageUrl={theme === 'light'
                        ? weatherData.icons?.day[index]
                        : weatherData.icons?.night[index]}
        >
          <div className="grid grid-cols-2 gap-5 md:gap-x-12 lg:gap-x-10 lg:gap-y-2">

            {cardOrder.map((card, cardIndex) => {
              const isRightSideColumn = cardIndex % 2 === 1;

              switch(card.id) {
                case "description":
                  return (
                    <ForecastCard
                      key="description"
                      onDragStart={(event) => handleDragStart(event, card.id)}
                      onDrop={(event) => handleDrop(event, card.id)}
                      onDragOver={handleDragOver}
                    >
                      <div className={`pl-4 text-sm md:text-2xl lg:text-lg ${isRightSideColumn ? 'text-right' : ''}`}>
                        <div className="flex items-center space-x-2">
                          <span>{forecast.dt_time_text}</span>
                          <TooltipIcon text={`${t('local_time')} ${forecast.dt_time_difference_text}`} />
                        </div>
                        <div>{forecast.description}</div>
                      </div>
                    </ForecastCard>
                  );

                  case "temperature":
                    return (
                      <ForecastCard
                        key="temperature"
                        onDragStart={(event) => handleDragStart(event, card.id)}
                        onDrop={(event) => handleDrop(event, card.id)}
                        onDragOver={handleDragOver}
                      >
                        <div className={`pl-4 text-sm md:text-2xl lg:text-lg ${isRightSideColumn ? 'text-right' : ''}`}>
                          <div>{t('temperature')}: {forecast.temperature}</div>
                          <div>{t('feels_like')}: {forecast.temperature_feels_like}</div>
                        </div>
                      </ForecastCard>
                    );

                  case "wind":
                    return (
                      <ForecastCard
                        key="wind"
                        onDragStart={(event) => handleDragStart(event, card.id)}
                        onDrop={(event) => handleDrop(event, card.id)}
                        onDragOver={handleDragOver}
                      >
                        <div className={`pl-4 text-sm md:text-2xl lg:text-lg ${isRightSideColumn ? 'text-right' : ''}`}>
                          <div>{t('wind')}: {forecast.wind_speed}</div>
                          <div>{t('wind_gusts')}: {forecast.wind_gusts}</div>
                        </div>

                        <div className="block lg:hidden absolute left-1/2 transform -translate-x-1/2">
                          <CompassNeedle direction={forecast.wind_direction} />
                        </div>

                        <div className="hidden lg:block relative pl-64">
                          <CompassNeedle direction={forecast.wind_direction} showCardinals={true} />
                        </div>

                      </ForecastCard>
                    );

                  case "cloudiness":
                    return (
                      <ForecastCard
                        key="cloudiness"
                        onDragStart={(event) => handleDragStart(event, card.id)}
                        onDrop={(event) => handleDrop(event, card.id)}
                        onDragOver={handleDragOver}
                      >
                        <div className={`pl-4 text-sm md:text-2xl lg:text-lg ${isRightSideColumn ? 'text-right' : ''}`}>
                          <div>{t('cloudiness')}: {forecast.cloudiness}</div>
                          <div>{t('rain_probability')}: {forecast.rain_probability_text}</div>
                        </div>
                      </ForecastCard>
                    );

                  case "pressure":
                    return (
                      <ForecastCard
                        key="pressure"
                        onDragStart={(event) => handleDragStart(event, card.id)}
                        onDrop={(event) => handleDrop(event, card.id)}
                        onDragOver={handleDragOver}
                      >
                        <div className={`hidden md:block lg:block pl-4 text-2xl lg:text-lg ${isRightSideColumn ? 'text-right' : ''}`}>
                          <div>{t('pressure')}: {forecast.pressure}</div>
                          <div>{t('pressure_ground')}: {forecast.pressure_grndl_level}</div>
                        </div>
                      </ForecastCard>
                    );

                  case "humidity":
                    return (
                      <ForecastCard
                        key="humidity"
                        onDragStart={(event) => handleDragStart(event, card.id)}
                        onDrop={(event) => handleDrop(event, card.id)}
                        onDragOver={handleDragOver}
                      >
                        <div className={`hidden md:block lg:block pl-4 text-2xl lg:text-lg ${isRightSideColumn ? 'text-right' : ''}`}>
                          <div>{t('humidity')}: {forecast.humidity_text}</div>
                          <div>
                            <PercentageBar ceaseAt={forecast.humidity} scales={[0, 50, 100]} />
                          </div>
                        </div>
                      </ForecastCard>
                    );
  
                  default:
                    return null;
                }
            })}
          </div>
        </ForecastCard>
      ))}
      <div className="relative group lg:col-span-2">
        <h2 className="text-xl font-semibold text-center pb-0">{weatherData.city_name}</h2>
        <div className="text-sm md:text-2xl lg:text-lg text-center">({weatherData.city_coords.lat}°, {weatherData.city_coords.lon}°)</div>
      </div>
    </div>
</div>
  );
};

export default DraggableCardManager;
