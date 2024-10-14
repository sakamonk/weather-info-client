/*
 * Library for extraxcting only relevant data from OpenWeatherMap API
 * Forecast JSON, depending which date's forecast we need.
 */

import { startOfToday, endOfToday, addDays, getUnixTime, fromUnixTime, format } from "date-fns";
import { da, nl, enUS, fi, fr, de, it, is, ja, ko, pt, ro, es, se } from "date-fns/locale";
import { WeatherInfoServerData, ExtractedForecastData, HumanReadableForecastData } from "../types/WeatherInfoServer.type";
import { filterArrayEvenly } from "./FilterArray";

// Extract only relevant data from the JSON.
// number is the page number in the app's routes. For example '2' means
// we want to get tomorrow's forecast, '3' the day after tomorrow's etc.
const ExtractForecast = (data: WeatherInfoServerData | null, page: number, unit: string, dateTimeFormat: string, dateFormat: string, timeFormat: string, maxDailyForecasts: number) => {
  if (!data || !data?.list) {
    return null;
  }

  const timestampRange = timestampsForPage(page);
  const dataForTimestampRange = extractDataForTimestampRange(data, timestampRange);

  // filter the data to show only the maxDailyForecasts amount of forecasts
  dataForTimestampRange.list = filterArrayEvenly(dataForTimestampRange.list, maxDailyForecasts);
  dataForTimestampRange.icons.night = filterArrayEvenly(dataForTimestampRange.icons.night, maxDailyForecasts);
  dataForTimestampRange.icons.day = filterArrayEvenly(dataForTimestampRange.icons.day, maxDailyForecasts);

  const humanReadableForecast = convertToHumanReadableForecast(dataForTimestampRange.list, unit, data.city.timezone, dateTimeFormat, dateFormat, timeFormat);
  const sunriseUnixLocal = data.city.sunrise + data.city.timezone;
  const sunsetUnixLocal = data.city.sunset + data.city.timezone;
  const city = data.city.name + ", " + data.city.country;
  const coords = { lat: data.city.coord.lat, lon: data.city.coord.lon };
  return {forecastWeather: humanReadableForecast, icons: dataForTimestampRange.icons, sunriseTs: sunriseUnixLocal, sunsetTs: sunsetUnixLocal, city_name: city, city_coords: coords};
}

// Get timestamp range for the day (page) we want.
// Returns Unix timestamps, UTC.
const timestampsForPage = (page: number) => {
  const forecastDay = page - 1;     // page number 2 means the first forecast day (tomorrow's forecast)
  const startOfForecast = addDays( startOfToday(), forecastDay );
  const endOfForecast = addDays( endOfToday(), forecastDay );
  const startOfForecastUnix = getUnixTime(startOfForecast);
  const endOfForecastUnix = getUnixTime(endOfForecast);

  const timeZoneOffset = new Date().getTimezoneOffset() * 60;  // TZ offset in seconds
  const startOfForecastUnixUtc = startOfForecastUnix + timeZoneOffset;
  const endOfForecastUnixUtc = endOfForecastUnix + timeZoneOffset;

  return { startTsUtc: startOfForecastUnixUtc, endTsUtc: endOfForecastUnixUtc };
};

// Extract only the data for the day we want.
const extractDataForTimestampRange = (data: WeatherInfoServerData, timestampRange: { startTsUtc: number, endTsUtc: number }) => {
  const listOfIcons: { night: string[], day: string[] } = { night: [], day: [] };
  const dataForTimestampRange = data.list.filter( (item, index: number) => {
    const itemUnixUtc = item.dt;   // Time of data forecasted, unix, UTC
    const inTimeRange = itemUnixUtc >= timestampRange.startTsUtc && itemUnixUtc <= timestampRange.endTsUtc;

    // Get the weather icons from the right indexes when applicable
    if (inTimeRange) {
      listOfIcons.night.push(data.icons.night[index]);
      listOfIcons.day.push(data.icons.day[index]);
    }

    return inTimeRange;
  });
  return { list: dataForTimestampRange, icons: listOfIcons };
};

// Select right temperature representation based on the used unit
const temperatureUnit = (unit: string) => {

  const unitTable = {
    standard: 'K',
    metric: 'C',
    imperial: 'F'
  };

  return `°${unitTable[unit as keyof typeof unitTable]}`;
};

// Select right wind representation based on the used unit
const windUnit = (unit: string) => {

  const unitTable = {
    standard: 'm/s',
    metric: 'm/s',
    imperial: 'mph'
  };

  return `${unitTable[unit as keyof typeof unitTable]}`;
};

const tsToText = (ts: number, dateTimeFormat: string, dateFormat: string, timeFormat: string) => {
  const result = { full_datetime: "", date: "", time: "" };
  const time = fromUnixTime(ts);

  result.full_datetime = format(time, dateTimeFormat);
  result.date = format(time, dateFormat);
  result.time = format(time, timeFormat);
  return result;
}

const convertToHumanReadableForecast = (data: ExtractedForecastData[], unit: string, timeZoneOffset: number, dateTimeFormat: string, dateFormat: string, timeFormat: string) => {
  const windUnitText = windUnit(unit);
  const temperatureUnitText = temperatureUnit(unit);

  const humanReadableForecast: HumanReadableForecastData[] = [];

  data.forEach(item => {
    const tsHash = tsToText(item.dt + timeZoneOffset, dateTimeFormat, dateFormat, timeFormat);
    const tzInHours = timeZoneOffset / 3600;

    let tzInHoursText = `(UTC)`;
    if (tzInHours < 0) {
      tzInHoursText = `(UTC-${tzInHours}h)`;
    } else if (tzInHours > 0) {
      tzInHoursText = `(UTC+${tzInHours}h)`;
    }

    const forecast = {
      dt: item.dt,
      dt_text: tsHash.full_datetime,
      dt_date_text: tsHash.date,
      dt_time_text: tsHash.time,
      dt_time_difference_text: tzInHoursText,
      main: item.weather[0].main,
      description: item.weather[0].description,
      temperature: `${item.main.temp} ${temperatureUnitText}`,
      temperature_feels_like: `${item.main.feels_like} ${temperatureUnitText}`,
      pressure: `${item.main.pressure} hPa`,
      pressure_grndl_level: `${item.main.grnd_level} hPa`,
      humidity: item.main.humidity,
      humidity_text: `${item.main.humidity} %`,
      cloudiness: `${item.clouds.all} %`,
      wind_speed: `${item.wind.speed} ${windUnitText}`,
      wind_direction: item.wind.deg,
      wind_gusts: `${item.wind.gust} ${windUnitText}`,
      visibility: `${item.visibility} m`,
      rain_probability: item.pop * 100,
      rain_probability_text: `${item.pop * 100} %`,
      rain_last_3h: "",
      snow_last_3h: "",
      part_of_the_day: item.sys.pod,
    };

    if (item?.rain !== undefined && item?.rain['3h'] !== undefined) {
      forecast.rain_last_3h = `${item.rain['3h']} mm`;
    }

    if (item?.snow !== undefined && item?.snow['3h'] !== undefined) {
      forecast.snow_last_3h = `${item.snow['3h']} mm`;
    }

    humanReadableForecast.push(forecast);
  });

  return humanReadableForecast;
};

export { ExtractForecast };

/*


Ennuste data
  * cnt = aikaleimojen määrä listalla
  * list.dt = ajankohta UTC-aikana

  * list.weather.main = Sään yleiskuvaus (Rain, Snow, Clouds, etc.)
  * list.weather.description = Sään kuvaus sanallisesti
  * list.main.temp = lämpötila (Kelvin/Celsius/Fahrenheit)
  * list.main.feels_like = tuntuu kuin (Kelvin/Celsius/Fahrenheit)

  * list.main.pressure = Ilmanpaine merenpinnan tasolla (hPa)
  * list.main.grnd_level = Ilmanpaine maanpinnalla (hPa)
  * list.main.humidity = Ilmankosteus (%)
  * list.clouds.all = Pilvisyys (%)

  * list.wind.speed = Tuulen nopeus (m/s tai miles/h)
  * list.wind.deg = Tuulen suunta (astetta)
  * list.wind.gust = Tuulen puuska (m/s tai miles/h)

  * list.visibility = Näkyvyys (metreinä)
  * list.pop = Sateen todennäköisyys (0-1)
  * list.rain.3h = Sateen määrä viimeisen 3 tunnin aikana (mm)
  * list.snow.3h = Lumisateen määrä viimeisen 3 tunnin aikana (mm)
  * list.sys.pod = Part of the day (d = day, n = night)
  * list.dt_txt = aikaleima teksti muodossa (2024-09-28 00:00:00), UTC
  * city.timezone = 10800 (Shift in seconds from UTC)
  * city.sunrise = 1727497461 (Unix-timestamp UTC)
  * city.sunset = 1727539584 (Unix-timestamp UTC)

"forecastWeather":{"cod":"200","message":0,"cnt":40,"list":[{"dt":1727481600,"main":{"temp":9.49,"feels_like":7.37,"temp_min":8.64,"temp_max":9.49,"pressure":985,"sea_level":985,"grnd_level":973,"humidity":95,"temp_kf":0.85},"weather":[{"id":501,"main":"Rain","description":"kohtalainen sade","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":4.01,"deg":299,"gust":8.49},"visibility":10000,"pop":1,"rain":{"3h":3.99},"sys":{"pod":"n"},"dt_txt":"2024-09-28 00:00:00"},{"dt":1727492400,"main":{"temp":8.73,"feels_like":7.17,"temp_min":8.13,"temp_max":8.73,"pressure":989,"sea_level":989,"grnd_level":977,"humidity":95,"temp_kf":0.6},"weather":[{"id":500,"main":"Rain","description":"pieni sade","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":2.72,"deg":278,"gust":5.84},"visibility":10000,"pop":1,"rain":{"3h":1.16},"sys":{"pod":"n"},"dt_txt":"2024-09-28 03:00:00"},{"dt":1727503200,"main":{"temp":8.42,"feels_like":8.42,"temp_min":8.42,"temp_max":8.42,"pressure":994,"sea_level":994,"grnd_level":979,"humidity":89,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"pieni sade","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":1.24,"deg":311,"gust":3.49},"visibility":10000,"pop":1,"rain":{"3h":0.12},"sys":{"pod":"d"},"dt_txt":"2024-09-28 06:00:00"},{"dt":1727514000,"main":{"temp":8.53,"feels_like":8.53,"temp_min":8.53,"temp_max":8.53,"pressure":996,"sea_level":996,"grnd_level":982,"humidity":88,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"pieni sade","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":1.3,"deg":314,"gust":2.28},"visibility":10000,"pop":0.36,"rain":{"3h":0.26},"sys":{"pod":"d"},"dt_txt":"2024-09-28 09:00:00"},{"dt":1727524800,"main":{"temp":9.63,"feels_like":9.63,"temp_min":9.63,"temp_max":9.63,"pressure":997,"sea_level":997,"grnd_level":983,"humidity":74,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"pieni sade","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":0.3,"deg":323,"gust":1.05},"visibility":10000,"pop":0.2,"rain":{"3h":0.13},"sys":{"pod":"d"},"dt_txt":"2024-09-28 12:00:00"},{"dt":1727535600,"main":{"temp":9.34,"feels_like":9.34,"temp_min":9.34,"temp_max":9.34,"pressure":999,"sea_level":999,"grnd_level":984,"humidity":80,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"pieni sade","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":0.85,"deg":241,"gust":1.05},"visibility":10000,"pop":0.3,"rain":{"3h":0.24},"sys":{"pod":"d"},"dt_txt":"2024-09-28 15:00:00"},{"dt":1727546400,"main":{"temp":7.64,"feels_like":6.54,"temp_min":7.64,"temp_max":7.64,"pressure":1002,"sea_level":1002,"grnd_level":987,"humidity":86,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"pieni sade","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":1.9,"deg":309,"gust":4.03},"visibility":10000,"pop":1,"rain":{"3h":0.7},"sys":{"pod":"n"},"dt_txt":"2024-09-28 18:00:00"},{"dt":1727557200,"main":{"temp":6.42,"feels_like":5.01,"temp_min":6.42,"temp_max":6.42,"pressure":1004,"sea_level":1004,"grnd_level":989,"humidity":87,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"pilvinen","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":2.01,"deg":323,"gust":5.41},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-09-28 21:00:00"},{"dt":1727568000,"main":{"temp":3.63,"feels_like":1.96,"temp_min":3.63,"temp_max":3.63,"pressure":1006,"sea_level":1006,"grnd_level":991,"humidity":86,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"hajanaisia pilviä","icon":"04n"}],"clouds":{"all":77},"wind":{"speed":1.83,"deg":300,"gust":2.17},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-09-29 00:00:00"},{"dt":1727578800,"main":{"temp":3.03,"feels_like":1.02,"temp_min":3.03,"temp_max":3.03,"pressure":1008,"sea_level":1008,"grnd_level":993,"humidity":88,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"taivas on selkeä","icon":"01n"}],"clouds":{"all":1},"wind":{"speed":2.05,"deg":274,"gust":4.35},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-09-29 03:00:00"},{"dt":1727589600,"main":{"temp":4.42,"feels_like":3.01,"temp_min":4.42,"temp_max":4.42,"pressure":1010,"sea_level":1010,"grnd_level":995,"humidity":88,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"taivas on selkeä","icon":"01d"}],"clouds":{"all":7},"wind":{"speed":1.72,"deg":267,"gust":6.1},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-09-29 06:00:00"},{"dt":1727600400,"main":{"temp":8.49,"feels_like":6.15,"temp_min":8.49,"temp_max":8.49,"pressure":1012,"sea_level":1012,"grnd_level":997,"humidity":70,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"pilvinen","icon":"04d"}],"clouds":{"all":87},"wind":{"speed":4,"deg":285,"gust":6.49},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-09-29 09:00:00"},{"dt":1727611200,"main":{"temp":9.89,"feels_like":7.76,"temp_min":9.89,"temp_max":9.89,"pressure":1014,"sea_level":1014,"grnd_level":1000,"humidity":53,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"pilvinen","icon":"04d"}],"clouds":{"all":93},"wind":{"speed":4.24,"deg":277,"gust":7.09},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-09-29 12:00:00"},{"dt":1727622000,"main":{"temp":7.74,"feels_like":5.03,"temp_min":7.74,"temp_max":7.74,"pressure":1017,"sea_level":1017,"grnd_level":1002,"humidity":64,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"ajoittaisia pilviä","icon":"03d"}],"clouds":{"all":26},"wind":{"speed":4.41,"deg":280,"gust":8.31},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-09-29 15:00:00"},{"dt":1727632800,"main":{"temp":4.08,"feels_like":1.61,"temp_min":4.08,"temp_max":4.08,"pressure":1020,"sea_level":1020,"grnd_level":1005,"humidity":79,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"vähän pilviä","icon":"02n"}],"clouds":{"all":16},"wind":{"speed":2.73,"deg":248,"gust":9.57},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-09-29 18:00:00"},{"dt":1727643600,"main":{"temp":2.87,"feels_like":0.39,"temp_min":2.87,"temp_max":2.87,"pressure":1022,"sea_level":1022,"grnd_level":1007,"humidity":81,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"taivas on selkeä","icon":"01n"}],"clouds":{"all":7},"wind":{"speed":2.49,"deg":247,"gust":8.39},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-09-29 21:00:00"},{"dt":1727654400,"main":{"temp":2.26,"feels_like":-0.23,"temp_min":2.26,"temp_max":2.26,"pressure":1024,"sea_level":1024,"grnd_level":1009,"humidity":83,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"taivas on selkeä","icon":"01n"}],"clouds":{"all":6},"wind":{"speed":2.38,"deg":254,"gust":8.89},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-09-30 00:00:00"},{"dt":1727665200,"main":{"temp":2.11,"feels_like":-0.11,"temp_min":2.11,"temp_max":2.11,"pressure":1026,"sea_level":1026,"grnd_level":1011,"humidity":88,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"taivas on selkeä","icon":"01n"}],"clouds":{"all":5},"wind":{"speed":2.1,"deg":266,"gust":6.29},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-09-30 03:00:00"},{"dt":1727676000,"main":{"temp":3.85,"feels_like":2.61,"temp_min":3.85,"temp_max":3.85,"pressure":1028,"sea_level":1028,"grnd_level":1013,"humidity":83,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"taivas on selkeä","icon":"01d"}],"clouds":{"all":5},"wind":{"speed":1.52,"deg":254,"gust":4.72},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-09-30 06:00:00"},{"dt":1727686800,"main":{"temp":9.04,"feels_like":7.64,"temp_min":9.04,"temp_max":9.04,"pressure":1030,"sea_level":1030,"grnd_level":1015,"humidity":60,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"taivas on selkeä","icon":"01d"}],"clouds":{"all":7},"wind":{"speed":2.57,"deg":258,"gust":4.3},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-09-30 09:00:00"},{"dt":1727697600,"main":{"temp":10.5,"feels_like":8.86,"temp_min":10.5,"temp_max":10.5,"pressure":1030,"sea_level":1030,"grnd_level":1015,"humidity":48,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"taivas on selkeä","icon":"01d"}],"clouds":{"all":8},"wind":{"speed":3.08,"deg":250,"gust":4.61},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-09-30 12:00:00"},{"dt":1727708400,"main":{"temp":8.38,"feels_like":7.39,"temp_min":8.38,"temp_max":8.38,"pressure":1030,"sea_level":1030,"grnd_level":1015,"humidity":61,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"taivas on selkeä","icon":"01d"}],"clouds":{"all":10},"wind":{"speed":1.91,"deg":201,"gust":3.18},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-09-30 15:00:00"},{"dt":1727719200,"main":{"temp":4.82,"feels_like":2.59,"temp_min":4.82,"temp_max":4.82,"pressure":1031,"sea_level":1031,"grnd_level":1015,"humidity":77,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"vähän pilviä","icon":"02n"}],"clouds":{"all":11},"wind":{"speed":2.61,"deg":179,"gust":9.06},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-09-30 18:00:00"},{"dt":1727730000,"main":{"temp":5.13,"feels_like":2.43,"temp_min":5.13,"temp_max":5.13,"pressure":1030,"sea_level":1030,"grnd_level":1015,"humidity":79,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"vähän pilviä","icon":"02n"}],"clouds":{"all":18},"wind":{"speed":3.33,"deg":182,"gust":11.62},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-09-30 21:00:00"},{"dt":1727740800,"main":{"temp":6.43,"feels_like":3.64,"temp_min":6.43,"temp_max":6.43,"pressure":1029,"sea_level":1029,"grnd_level":1014,"humidity":79,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"ajoittaisia pilviä","icon":"03n"}],"clouds":{"all":29},"wind":{"speed":3.96,"deg":197,"gust":12.9},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-10-01 00:00:00"},{"dt":1727751600,"main":{"temp":8.04,"feels_like":5.59,"temp_min":8.04,"temp_max":8.04,"pressure":1028,"sea_level":1028,"grnd_level":1013,"humidity":75,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"pilvinen","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":4,"deg":202,"gust":11.74},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-10-01 03:00:00"},{"dt":1727762400,"main":{"temp":7.92,"feels_like":5.71,"temp_min":7.92,"temp_max":7.92,"pressure":1028,"sea_level":1028,"grnd_level":1013,"humidity":76,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"pieni sade","icon":"10d"}],"clouds":{"all":95},"wind":{"speed":3.5,"deg":205,"gust":10.35},"visibility":10000,"pop":0.2,"rain":{"3h":0.12},"sys":{"pod":"d"},"dt_txt":"2024-10-01 06:00:00"},{"dt":1727773200,"main":{"temp":11.52,"feels_like":10.5,"temp_min":11.52,"temp_max":11.52,"pressure":1028,"sea_level":1028,"grnd_level":1013,"humidity":68,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"vähän pilviä","icon":"02d"}],"clouds":{"all":14},"wind":{"speed":3.95,"deg":223,"gust":6.92},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-10-01 09:00:00"},{"dt":1727784000,"main":{"temp":13.09,"feels_like":11.94,"temp_min":13.09,"temp_max":13.09,"pressure":1027,"sea_level":1027,"grnd_level":1012,"humidity":57,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"ajoittaisia pilviä","icon":"03d"}],"clouds":{"all":26},"wind":{"speed":3.62,"deg":240,"gust":5.4},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-10-01 12:00:00"},{"dt":1727794800,"main":{"temp":10.24,"feels_like":9.41,"temp_min":10.24,"temp_max":10.24,"pressure":1026,"sea_level":1026,"grnd_level":1011,"humidity":80,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"pilvinen","icon":"04d"}],"clouds":{"all":93},"wind":{"speed":2.52,"deg":206,"gust":5.87},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-10-01 15:00:00"},{"dt":1727805600,"main":{"temp":7.18,"feels_like":6.26,"temp_min":7.18,"temp_max":7.18,"pressure":1026,"sea_level":1026,"grnd_level":1011,"humidity":93,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"pilvinen","icon":"04n"}],"clouds":{"all":95},"wind":{"speed":1.65,"deg":234,"gust":2.09},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-10-01 18:00:00"},{"dt":1727816400,"main":{"temp":6.3,"feels_like":6.3,"temp_min":6.3,"temp_max":6.3,"pressure":1026,"sea_level":1026,"grnd_level":1011,"humidity":95,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"hajanaisia pilviä","icon":"04n"}],"clouds":{"all":82},"wind":{"speed":1.28,"deg":238,"gust":1.24},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-10-01 21:00:00"},{"dt":1727827200,"main":{"temp":5.55,"feels_like":5.55,"temp_min":5.55,"temp_max":5.55,"pressure":1026,"sea_level":1026,"grnd_level":1011,"humidity":95,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"pilvinen","icon":"04n"}],"clouds":{"all":86},"wind":{"speed":0.97,"deg":225,"gust":0.93},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-10-02 00:00:00"},{"dt":1727838000,"main":{"temp":4.9,"feels_like":4.9,"temp_min":4.9,"temp_max":4.9,"pressure":1025,"sea_level":1025,"grnd_level":1010,"humidity":96,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"pilvinen","icon":"04n"}],"clouds":{"all":92},"wind":{"speed":1.24,"deg":200,"gust":1.21},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-10-02 03:00:00"},{"dt":1727848800,"main":{"temp":6.07,"feels_like":6.07,"temp_min":6.07,"temp_max":6.07,"pressure":1025,"sea_level":1025,"grnd_level":1010,"humidity":92,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"hajanaisia pilviä","icon":"04d"}],"clouds":{"all":69},"wind":{"speed":0.59,"deg":188,"gust":0.7},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-10-02 06:00:00"},{"dt":1727859600,"main":{"temp":10.63,"feels_like":9.65,"temp_min":10.63,"temp_max":10.63,"pressure":1024,"sea_level":1024,"grnd_level":1010,"humidity":73,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"ajoittaisia pilviä","icon":"03d"}],"clouds":{"all":48},"wind":{"speed":0.82,"deg":162,"gust":0.93},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-10-02 09:00:00"},{"dt":1727870400,"main":{"temp":11.86,"feels_like":10.77,"temp_min":11.86,"temp_max":11.86,"pressure":1023,"sea_level":1023,"grnd_level":1008,"humidity":64,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"hajanaisia pilviä","icon":"04d"}],"clouds":{"all":68},"wind":{"speed":1.16,"deg":143,"gust":1.04},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-10-02 12:00:00"},{"dt":1727881200,"main":{"temp":9.77,"feels_like":9.77,"temp_min":9.77,"temp_max":9.77,"pressure":1023,"sea_level":1023,"grnd_level":1008,"humidity":74,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"pilvinen","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":0.98,"deg":134,"gust":0.9},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-10-02 15:00:00"},{"dt":1727892000,"main":{"temp":7.55,"feels_like":7.55,"temp_min":7.55,"temp_max":7.55,"pressure":1023,"sea_level":1023,"grnd_level":1008,"humidity":86,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"pilvinen","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":0.84,"deg":151,"gust":0.89},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-10-02 18:00:00"},{"dt":1727902800,"main":{"temp":7.83,"feels_like":7.83,"temp_min":7.83,"temp_max":7.83,"pressure":1023,"sea_level":1023,"grnd_level":1008,"humidity":85,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"pilvinen","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":0.95,"deg":277,"gust":0.94},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-10-02 21:00:00"}],"city":{"id":634963,"name":"Tampere","coord":{"lat":61.4991,"lon":23.7871},"country":"FI","population":0,"timezone":10800,"sunrise":1727497461,"sunset":1727539584},"icons":{"night":["https://openweathermap.org/img/wn/10n@2x.png","https://openweathermap.org/img/wn/10n@2x.png","https://openweathermap.org/img/wn/10n@2x.png","https://openweathermap.org/img/wn/10n@2x.png","https://openweathermap.org/img/wn/10n@2x.png","https://openweathermap.org/img/wn/10n@2x.png","https://openweathermap.org/img/wn/10n@2x.png","https://openweathermap.org/img/wn/04n@2x.png","https://openweathermap.org/img/wn/04n@2x.png","https://openweathermap.org/img/wn/01n@2x.png","https://openweathermap.org/img/wn/01n@2x.png","https://openweathermap.org/img/wn/04n@2x.png","https://openweathermap.org/img/wn/04n@2x.png","https://openweathermap.org/img/wn/03n@2x.png","https://openweathermap.org/img/wn/02n@2x.png","https://openweathermap.org/img/wn/01n@2x.png","https://openweathermap.org/img/wn/01n@2x.png","https://openweathermap.org/img/wn/01n@2x.png","https://openweathermap.org/img/wn/01n@2x.png","https://openweathermap.org/img/wn/01n@2x.png","https://openweathermap.org/img/wn/01n@2x.png","https://openweathermap.org/img/wn/01n@2x.png","https://openweathermap.org/img/wn/02n@2x.png","https://openweathermap.org/img/wn/02n@2x.png","https://openweathermap.org/img/wn/03n@2x.png","https://openweathermap.org/img/wn/04n@2x.png","https://openweathermap.org/img/wn/10n@2x.png","https://openweathermap.org/img/wn/02n@2x.png","https://openweathermap.org/img/wn/03n@2x.png","https://openweathermap.org/img/wn/04n@2x.png","https://openweathermap.org/img/wn/04n@2x.png","https://openweathermap.org/img/wn/04n@2x.png","https://openweathermap.org/img/wn/04n@2x.png","https://openweathermap.org/img/wn/04n@2x.png","https://openweathermap.org/img/wn/04n@2x.png","https://openweathermap.org/img/wn/03n@2x.png","https://openweathermap.org/img/wn/04n@2x.png","https://openweathermap.org/img/wn/04n@2x.png","https://openweathermap.org/img/wn/04n@2x.png","https://openweathermap.org/img/wn/04n@2x.png"],"day":["https://openweathermap.org/img/wn/10d@2x.png","https://openweathermap.org/img/wn/10d@2x.png","https://openweathermap.org/img/wn/10d@2x.png","https://openweathermap.org/img/wn/10d@2x.png","https://openweathermap.org/img/wn/10d@2x.png","https://openweathermap.org/img/wn/10d@2x.png","https://openweathermap.org/img/wn/10d@2x.png","https://openweathermap.org/img/wn/04d@2x.png","https://openweathermap.org/img/wn/04d@2x.png","https://openweathermap.org/img/wn/01d@2x.png","https://openweathermap.org/img/wn/01d@2x.png","https://openweathermap.org/img/wn/04d@2x.png","https://openweathermap.org/img/wn/04d@2x.png","https://openweathermap.org/img/wn/03d@2x.png","https://openweathermap.org/img/wn/02d@2x.png","https://openweathermap.org/img/wn/01d@2x.png","https://openweathermap.org/img/wn/01d@2x.png","https://openweathermap.org/img/wn/01d@2x.png","https://openweathermap.org/img/wn/01d@2x.png","https://openweathermap.org/img/wn/01d@2x.png","https://openweathermap.org/img/wn/01d@2x.png","https://openweathermap.org/img/wn/01d@2x.png","https://openweathermap.org/img/wn/02d@2x.png","https://openweathermap.org/img/wn/02d@2x.png","https://openweathermap.org/img/wn/03d@2x.png","https://openweathermap.org/img/wn/04d@2x.png","https://openweathermap.org/img/wn/10d@2x.png","https://openweathermap.org/img/wn/02d@2x.png","https://openweathermap.org/img/wn/03d@2x.png","https://openweathermap.org/img/wn/04d@2x.png","https://openweathermap.org/img/wn/04d@2x.png","https://openweathermap.org/img/wn/04d@2x.png","https://openweathermap.org/img/wn/04d@2x.png","https://openweathermap.org/img/wn/04d@2x.png","https://openweathermap.org/img/wn/04d@2x.png","https://openweathermap.org/img/wn/03d@2x.png","https://openweathermap.org/img/wn/04d@2x.png","https://openweathermap.org/img/wn/04d@2x.png","https://openweathermap.org/img/wn/04d@2x.png","https://openweathermap.org/img/wn/04d@2x.png"]},"cities":[{"name":"Tampere","country":"FI"}]}}



*/

/*
 * Language options defined in a 2D array.
 * Each sub-array contains the language code and the language name.
 * Surely there exists components that can handle this more elegantly,
 * like for example react-simple-country-select, but for the sake of
 * simplicity and defining only handful of options, we'll just use a 2D array.
 */

