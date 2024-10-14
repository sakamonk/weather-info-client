/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_HOST: string;
  readonly VITE_SERVER_PORT: number;
  readonly VITE_CURRENT_WEATHER_API_ENDPOINT: string;
  readonly VITE_FORECAST_API_ENDPOINT: string;
  readonly VITE_DEFAULT_API_LANG: string;
  readonly VITE_DEFAULT_API_UNIT: string;
  readonly VITE_DEFAULT_APP_THEME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
