import { DateTime } from 'luxon';

import { getSavedEntries, deleteEntry } from './apis/entry';

const createImageContainer = (imageUrl) => {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('trip-image-container');
    const tripImage = document.createElement('img');
    tripImage.src = imageUrl;
    imageContainer.appendChild(tripImage);
    return imageContainer;
};

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
    weatherTextElement.innerHTML = `Weather Forecast: <strong>${temperature}&#8451;</strong>, ${weatherDescription}`;
    weatherElement.append(weatherTextElement);
    if (weatherIcon) {
        const weatherIconElement = document.createElement('img');
        weatherIconElement.src = `/static/images/weather-icons/${weatherIcon}.png`;
        weatherElement.append(weatherIconElement);
    }
    return weatherElement;
};

const createLocationElement = (name, countryName) => {
    const locationElement = document.createElement('div');
    locationElement.classList.add('trip-location');
    locationElement.innerText = `${name}, ${countryName}`;
    return locationElement;
};

const createButtonGroup = (id) => {
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('trip-button-group');
    const removeTripButton = document.createElement('button');
    removeTripButton.classList.add('remove-trip');
    removeTripButton.innerText = 'Remove Trip';
    removeTripButton.addEventListener('click', async (evt) => {
        evt.preventDefault();
        await deleteEntry(id);
        const entryHolder = document.getElementById('entry-holder');
        const entryElement = document.querySelector(`[data-entry-id="${id}"]`);
        entryHolder.removeChild(entryElement)
    });
    buttonGroup.appendChild(removeTripButton);
    return buttonGroup;
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
     *  <div class="trip-entry" data-entry-id="1">
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
    container.dataset.entryId = id;
    container.classList.add('trip-entry');

    const imageContainer = createImageContainer(imageUrl);
    container.appendChild(imageContainer);

    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('trip-description');
    descriptionContainer.appendChild(createLocationElement(name, countryName));
    descriptionContainer.appendChild(createDepartureElement(departureDate));
    descriptionContainer.appendChild(
        createWeatherElement(temperature, weatherDescription, weatherIcon),
    );
    container.appendChild(descriptionContainer);

    const buttonGroup = createButtonGroup(id);
    container.appendChild(buttonGroup);

    const entryHolder = document.getElementById('entry-holder');
    entryHolder.appendChild(container);
};

export const loadRecentTrips = async () => {
    const entries = await getSavedEntries();
    for (const entry of entries) {
        appendNewTrip(entry);
    }
};
