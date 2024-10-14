import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
//import LanguageDetector from 'i18next-browser-languagedetector';

i18n
//  .use(LanguageDetector) // Detects the user's language
  .use(initReactI18next) // Integrates with React
  .init({
    resources: {
      en: {
        translation: {
          temperature: 'Temperature',
          feels_like: 'Feels like',
          wind: 'Wind',
          wind_gusts: 'Gusts',
          cloudiness: 'Cloudiness',
          humidity: 'Humidity',
          rain_probability: 'Rain probability',
          date_time_format: '',
          date_format: 'MM/dd/yyyy',
          time_format: 'hh:mm aaa',
          local_time: 'Local time',
          pressure: 'Pressure',
          pressure_ground: 'at ground level',
        },
      },
      fi: {
        translation: {
          temperature: 'Lämpötila',
          feels_like: 'Tuntuu kuin',
          wind: 'Tuuli',
          wind_gusts: 'Puuskat',
          cloudiness: 'Pilvisyys',
          humidity: 'Ilmankosteus',
          rain_probability: 'Sateen todennäk',
          date_time_format: 'dd.MM.yyyy HH:mm',
          date_format: 'dd.MM.yyyy',
          time_format: 'HH:mm',
          local_time: 'Paikallista aikaa',
          pressure: 'Ilmapaine',
          pressure_ground: 'maanpinnalla',
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
