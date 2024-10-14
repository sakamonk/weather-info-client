# Weather Info Client

As a side note, I have developed this application to learn more about the modern web technologies of **Node.js**, **Typescript** and **React**.

---

Weather Info Client is a web application that displays the current weather and forecast data for a selected location. It works in tandem with the [Weather Info Server](https://github.com/sakamonk/weather-info-server) to fetch the weather data from external APIs. This project is built using **Node.js**, **TypeScript**, and **React**, with **Cypress** for integration testing.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Available Scripts](#available-scripts)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [License](#license)

## Features

- **Current Weather Information**: Displays current weather details like temperature, humidity, wind speed, etc.
- **Forecast Cards**: Users can view a detailed forecast for upcoming days.
- **Drag-and-Drop Interface**: Users can rearrange forecast cards for better user experience.
- **Customizable Themes**: Users can switch between light, dark, and system themes.
- **Internationalization**: Supports multiple languages using i18next.
- **Responsive Design**: Tailored for different screen sizes (mobile, tablet, and desktop).
- **Unit Selection**: Metric and imperial units are available for temperature and wind speed.
- **Real-time weather updates**: Integration with [Weather Info Server](https://github.com/sakamonk/weather-info-server).
- **Cypress Testing**: Integration and end-to-end testing using Cypress.


## Technologies Used

- **Node.js** - Backend runtime environment.
- **TypeScript** - JavaScript with static types, providing type safety and tooling.
- **React** - Frontend library for building user interfaces.
- **Tailwind CSS** - Utility-first CSS framework for responsive design.
- **Cypress** - End-to-end testing framework.
- **i18next** - Internationalization framework for React applications.
- **tw-elements-react** - React components with Tailwind CSS support for UI elements.


## Installation

### Prerequisites

- **Node.js**: Make sure you have Node.js version 20.x or later installed. You can download it from [here](https://nodejs.org/).
- **npm**: npm comes with Node.js. Make sure you have it installed.
- **Weather Info Server** up and running. You can get it from [here](https://github.com/sakamonk/weather-info-server)


### Steps

#### 1. Clone the repository:

  ```
git clone https://github.com/sakamonk/weather-info-client.git
  ```

#### 2. Navigate into the directory:

  ```
cd weather-info-client
  ```

#### 3. Install dependencies:

  ```
npm install
  ```

#### 4. Configure environment variables. Refer to [Environment Variables](#environment-variables).


## Running the Application

### In Development Mode

To start the application in development mode:

  ```
   npm run dev
  ```

This will launch the app in http://localhost:4000.

### Building the Application

To create a production build:

  ```
   npm run build
  ```

The production ready files will be created in the `dist/` folder.

### Starting the Production Build

After building the app, start the production server with:

  ```
   npm run start
  ```

## Running Tests

Cypress is used for end-to-end testing. To run Cypress tests:

#### 1. Start the development server:

  ```
   npm run dev
  ```

#### 2. Run Cypress in interactive mode:

  ```
   npm run cypress:open
  ```

This will open the Cypress test runner interface.

#### 3. Run Cypress in headless mode:

  ```
   npm run cypress:run
  ```

### Environment Variables

The app relies on several environment variables that need to be configured in an `.env` file at the root of the project. Here's an example `.env` file:

  ```
  VITE_SERVER_HOST=http://localhost
  VITE_SERVER_PORT=3500

  VITE_CURRENT_WEATHER_API_ENDPOINT=api/weather
  VITE_FORECAST_API_ENDPOINT=api/weather/forecast

  VITE_DEFAULT_API_LANG=fi
  VITE_DEFAULT_API_UNIT=metric

  VITE_DEFAULT_APP_THEME=system
  ```


### Key Variables

- `VITE_SERVER_HOST` HOST URL of the Weather Info Server's API.
- `VITE_SERVER_PORT` PORT of the Weather Info Server's API.
- `VITE_CURRENT_WEATHER_API_ENDPOINT` Endpoint for the current weather for the Weather Info Server's API.
- `VITE_FORECAST_API_ENDPOINT` Endpoint for the weather forecast for the Weather Info Server's API.
- `VITE_DEFAULT_API_LANG` Default language for fetching weather data.
- `VITE_DEFAULT_API_UNIT` Default measurement unit (metric/imperial/statistical).
- `VITE_DEFAULT_APP_THEME` Default theme (light, dark, or system).


## Available Scripts

### Linting

Check for linting errors:

```
npm run lint
```

You can also automatically fix linting errors in the code by running:

```
npm run lint:fix
```



## Folder Structure

```
weather-info-client/
├── public/               # Static assets
├── src/                  # Main source code
│   ├── components/       # React components
│   ├── pages/            # Navigationable pages
│   ├── services/         # API service calls
│   ├── types/            # TypeScript interfaces and types
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main application component
│   └── index.tsx         # Entry point of the app
├── cypress/              # Cypress test cases
├── dist                  # Compiled JavaScript (after build)
├── .env                  # Environment variable file (not included in version control)
├── .env.example          # Sample Environment variable file
├── .gitignore            # Git ignore file
├── eslint.config.js      # ESLint configuration
├── i18n.config.json      # Internationalization configuration
├── package.json          # Project configurations and dependencies
├── README.md             # Documentation
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration

```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
