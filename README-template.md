# Weather App

A modern weather application built using React, inspired by the Frontend Mentor Weather App challenge. This app allows users to search for weather data, view current conditions, forecasts, and switch between units for a tailored experience.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Learnings](#learnings)
- [Future Improvements](#future-improvements)
- [Useful Resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

This web application lets users quickly access weather information for any location. It displays current conditions, hourly and daily forecasts, and allows users to toggle between metric and imperial units.

## Features

- geo-location: get weather details for your current location
- save current location to local storage to minimize location API search
- Search for weather information by location
- View current weather conditions: temperature, weather icon, and location details
- See additional metrics: feels-like temperature, humidity, wind speed, and precipitation
- Browse a 7-day weather forecast with daily high/low temperatures
- Hourly forecast with temperature trends and day selector
- Switch between Celsius/Fahrenheit, km/h/mph, and mm/in for precipitation
- Responsive design for mobile and desktop
- Accessible UI with hover/focus states

## Screenshots

Add screenshots of your app here, e.g.:

![Main weather dashboard](./screenshot.jpg)

[Project structure](https://gitingest.com/ChamuMutezva/weather-app-2025)

```js
Directory structure:
└── chamumutezva-weather-app-2025/
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── README-template.md
    ├── style-guide.md
    ├── tailwind.config.js
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── api/
    │   └── advice.ts
    ├── public/
    │   └── assets/
    │       ├── fonts/
    │       │   ├── Bricolage_Grotesque/
    │       │   │   ├── README.txt
    │       │   │   └── OFL.txt
    │       │   └── DM_Sans/
    │       │       ├── README.txt
    │       │       └── OFL.txt
    │       └── images/
    │           ├── icon-drizzle.webp
    │           ├── icon-fog.webp
    │           ├── icon-overcast.webp
    │           ├── icon-partly-cloudy.webp
    │           ├── icon-rain.webp
    │           ├── icon-snow.webp
    │           ├── icon-storm.webp
    │           └── icon-sunny.webp
    └── src/
        ├── App.tsx
        ├── ErrorBoundary.tsx
        ├── global.css
        ├── main.tsx
        ├── vite-env.d.ts
        ├── Weather.tsx
        ├── api/
        │   └── geminiService.ts
        ├── components/
        │   ├── AIWeatherAdvisor.tsx
        │   ├── DailyForecast.tsx
        │   ├── DisplayLocation.tsx
        │   ├── Header.tsx
        │   ├── LocationCombobox.tsx
        │   ├── SevenDayHourlyForecast.tsx
        │   ├── SevenDayHourlyForecastDisplay.tsx
        │   └── WeatherToday.tsx
        ├── hooks/
        │   └── react-query.ts
        ├── types/
        │   └── types.ts
        └── utility/
            ├── checkSimilarCoords.ts
            ├── convertToImperial.ts
            ├── getWeatherIcon.tsx
            └── reducers.ts
```

## Live Demo

- [Live Site URL](https://your-live-site-url.com)
- [Frontend Mentor Challenge](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49)

## Tech Stack

- React
- TanStack Query - for data searching
- Tailwind CSS & Headless UI
- Open-meteo API for weather data

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run locally: `pnpm run dev`
4. Open `http://localhost:5173` in your browser

## Learnings

Share key learnings, such as API integration, responsive design, accessibility with Headless UI, and state management in React. Include code snippets or explanations of major challenges solved.

## Future Improvements

- Add user location detection
- Enable weather alerts/notifications
- Improve loading and error states
- Add more detailed hourly forecast graphs
- Optimize for performance and SEO

## Useful Resources

- [React documentation](https://react.dev/)
- [Next.js documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Open-meteo API](https://open-meteo.com/en/docs)
- [TanStack query](https://tanstack.com/)
- [Headless-ui](https://headlessui.com/react/menu)

## Author

- Name: Chamu Mutezva
- Frontend Mentor: [@ChamuMutezva](https://www.frontendmentor.io/profile/ChamuMutezva)

## Acknowledgments

Thanks to Frontend Mentor and the open-source community for resources and inspiration.