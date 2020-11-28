import { DateTime } from 'luxon';

import { saveEntry } from './apis/entry';
import { findGeocodesByPlaceName } from './apis/geonames';
import { getPredictedWeatherFromHistoricalData, getRecentWeatherForecast } from './apis/weatherbit';
import { getPictureForPlace } from './apis/pixabay';
import { appendNewTrip } from './tripPreview';

const showError = (errorMessage) => {
    const errorMessageElement = document.getElementById('form-error-message');
    errorMessageElement.innerText = errorMessage;
};

const clearError = () => {
    const errorMessageElement = document.getElementById('form-error-message');
    errorMessageElement.innerText = '';
};

/**
 * Validate if the input in form data is correct.
 * @param {*} formData
 */
export const validateFormData = (formData) => {
    const location = formData.get('location');
    if (!location) {
        throw new Error('Travel destination is missing.');
    }
    const departureDateString = formData.get('departure');
    if (!departureDateString) {
        throw new Error('Departure date is missing.');
    }

    const now = DateTime.local().startOf('day');
    const departureDate = DateTime.fromFormat(departureDateString, 'yyyy-MM-dd');
    if (departureDate < now) {
        throw new Error('Departure date is in the past.');
    }
    return { location, departureDate };
};

const saveAndUpdateWeatherEntry = async (newEntry) => {
    const savedEntry = await saveEntry(newEntry);
    appendNewTrip(savedEntry);
};

export const addTripFormHandler = async (event) => {
    event.preventDefault();
    clearError();

    const formData = new FormData(event.target);
    try {
        const { location, departureDate } = validateFormData(formData);
        const diffInDays = departureDate.diff(DateTime.local()).get('days');

        // Retrieve geocodes for the given location
        const geocodes = await findGeocodesByPlaceName(location);
        if (!geocodes) {
            throw new Error(`Cannot find destination "${location}".`);
        }

        // Retrieve weather information. If within 16 days, use weather forecast,
        // otherwise guess the weather based on historical values.
        const weather = await (diffInDays < 16
            ? getRecentWeatherForecast(geocodes.latitude, geocodes.longitude, diffInDays)
            : getPredictedWeatherFromHistoricalData(
                geocodes.latitude, geocodes.longitude, departureDate,
            )
        );
        if (!weather) {
            throw new Error(`Cannot find weather for "${location}".`);
        }

        // Look up a photo for the given place. If not found, search photos for
        // the country instead.
        let photo = await getPictureForPlace(`${geocodes.name}+${geocodes.countryName}`);
        if (!photo) {
            photo = await getPictureForPlace(`${geocodes.countryName}`);
        }

        await saveAndUpdateWeatherEntry({
            name: geocodes.name,
            countryName: geocodes.countryName,
            departureDate: departureDate.toISO(),
            latitude: geocodes.latitude,
            longitude: geocodes.longitude,
            temperature: weather.temp,
            weatherIcon: weather.weather.icon,
            weatherDescription: weather.weather.description,
            imageUrl: photo ? photo.webformatURL : null,
        });
        event.target.reset();
    } catch (e) {
        showError(e.message);
    }
};

export const registerFormHandlers = () => {
    const travelForm = document.getElementById('travel-form');
    travelForm.addEventListener('submit', addTripFormHandler);
    // Set the earlier start date to be today.
    const departureDateInput = document.getElementById('departure');
    departureDateInput.setAttribute('min', DateTime.local().toFormat('yyyy-MM-dd'));
};
