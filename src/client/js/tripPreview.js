import { DateTime } from 'luxon';

import { getSavedEntries, deleteEntry } from './apis/entry';

const createDepartureElement = (departureDateString) => {
    const departureDate = DateTime.fromISO(departureDateString);
    const daysAway = departureDate.diffNow(['day', 'second']).get('days');

    const departureElement = document.createElement('div');
    departureElement.classList.add('trip-departure-date');
    const daysAwayText = daysAway > 1 ? `${daysAway} days away` : `${daysAway} day away`;
    departureElement.innerHTML = `Departure Date: ${departureDate.toLocaleString(DateTime.DATE_SHORT)}, <strong>${daysAwayText}</strong>`;
    return departureElement;
};

const createWeatherElement = (temperature, weatherDescription, weatherIcon) => {
    const weatherElement = document.createElement('div');
    weatherElement.classList.add('trip-weather');
    const weatherTextElement = document.createElement('span');
    weatherTextElement.innerHTML = `Weather Forecast: ${temperature}&#8451;, ${weatherDescription}`;
    weatherElement.append(weatherTextElement);
    if (weatherIcon) {
        const weatherIconElement = document.createElement('img');
        weatherIconElement.src = `/static/images/weather-icons/${weatherIcon}.png`;
        weatherElement.append(weatherIconElement);
    }
    return weatherElement;
};

export const appendNewTrip = ({
    id,
    name,
    countryName,
    departureDate,
    temperature,
    weatherIcon,
    weatherDescription,
    imageUrl,
}) => {
    /**
     * Template of buttons inserted:
     *
     *  <div class="trip-entry">
     *      <div class="trip-image-container></div>
     *      <div class="trip-description">
     *          <div class="trip-location"></div>
     *          <div class="trip-weather"></div>
     *          <div class="trip-departure-date"></div>
     *      </div>
     *      <div class="trip-button-group">
     *          <button class="remove-trip">Remove Trip</button>
     *      </div>
     *  </div>
    */

    const container = document.createElement('div');
    container.classList.add('trip-entry');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('trip-image-container');
    const tripImage = document.createElement('img');
    tripImage.src = imageUrl;
    imageContainer.appendChild(tripImage);
    container.append(imageContainer);

    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('trip-description');
    const locationElement = document.createElement('div');
    locationElement.classList.add('trip-location');
    locationElement.innerText = `${name}, ${countryName}`;
    descriptionContainer.appendChild(locationElement);
    const departureElement = createDepartureElement(departureDate);
    descriptionContainer.appendChild(departureElement);
    const weatherElement = createWeatherElement(temperature, weatherDescription, weatherIcon);
    descriptionContainer.appendChild(weatherElement);
    container.append(descriptionContainer);

    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('trip-button-group');
    const removeTripButton = document.createElement('button');
    removeTripButton.classList.add('remove-trip');
    removeTripButton.addEventListener('click', async (evt) => {
        evt.preventDefault();
        await deleteEntry(id);
    });

    const entryHolder = document.getElementById('entry-holder');
    entryHolder.appendChild(container);
};

export const loadRecentTrips = async () => {
    const entries = await getSavedEntries();
    for (const entry of entries) {
        appendNewTrip(entry);
    }
};
