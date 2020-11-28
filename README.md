# Travel App

This is a project submission for Udacity front-end project: Travel app. The code
has been based on my previous submission of my last two submissions for ["weather journal"](https://github.com/eastenluis/udacity-fend-weather-journal-app) and "evaluate nlp news".

Some third party libraries used:

- luxon: Handling dates and formatting.
- dotenv: For defining environment variables in `.env` file.
- supertest: For testing express routes.

## Set up

- Run `npm install` to install packages.
- Copy `.env.example` and rename the copy to `.env`. Fill in the API keys or user names
used by third party web services:
    - `GEONAMES_USERNAME`: Geonames username
    - `WEATHERBIT_API_KEY`: Weatherbit API key
    - `PIXABAY_API_KEY`: Pixabay API key

### Run web app in development build:
- Run `npm run dev` & `npm run start` in separate shells
- Access the web app through `localhost:8080`

### Run web app in production build:
- Run `npm run prod` to build web app codes
- Run `npm run start` to start web server
- Access the web app through `localhost:8081`

### Run local Jest Test
- Run `npm test` to run client & server tests.

## Extended Options
- Pull in an image for the country from Pixabay API when the entered location brings up no results.
- Allow the user to add additional trips.
- Allow the user to remove the trip.
- Incorporate icons into forecast.
