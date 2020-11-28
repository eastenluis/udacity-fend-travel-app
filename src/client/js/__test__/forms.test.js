import { DateTime } from 'luxon';

import { addTripFormHandler } from '../forms';
import { saveEntry } from '../apis/entry';
import { findGeocodesByPlaceName } from '../apis/geonames';
import { getRecentWeatherForecast } from '../apis/weatherbit';
import { getPictureForPlace } from '../apis/pixabay';

jest.mock('../apis/geonames');
jest.mock('../apis/pixabay');
jest.mock('../apis/weatherbit');
jest.mock('../apis/entry');

const formHTML = `
<form
    id="travel-form"
    name="travel-form"
    class="travel-form"
>
    <div class="form-control">
        <label for="location">Travel Destination</label>
        <input
            type="text"
            id="location"
            name="location"
            placeholder="E.g. city name, zip codes"
        />
    </div>
    <div class="form-control">
        <label for="departure">Departure Date</label>
        <input type="date" id="departure" name="departure" />
    </div>
    <div class="form-footer">
        <div id="form-error-message"></div>
        <div class="form-button-group">
            <button id="add-trip" type="submit">Add New Trip</button>
        </div>
    </div>
</form>
<div id="entry-holder"></div>
`;

describe('Travel Form', () => {
    beforeEach(() => {
        document.body.innerHTML = formHTML;
    });

    const assertErrorMessage = (errorMessage) => {
        const errorElement = document.getElementById('form-error-message');
        expect(errorElement.innerText).toEqual(errorMessage);
    };

    const createMockFormEvent = () => {
        const formElement = document.getElementById('travel-form');
        return {
            preventDefault: () => {},
            target: formElement,
        };
    };

    const fillInputValue = (id, value) => {
        const inputElement = document.getElementById(id);
        inputElement.value = value;
    };

    it('displays error message when destination is missing', async () => {
        await addTripFormHandler(createMockFormEvent());
        assertErrorMessage('Travel destination is missing.');
    });

    it('displays error message when the departure date is missing', async () => {
        fillInputValue('location', 'Somewhere fancy');
        await addTripFormHandler(createMockFormEvent());
        assertErrorMessage('Departure date is missing.');
    });

    it('creates entry element after submission', async () => {
        const departureDate = DateTime.local().plus({ days: 2 }).startOf('day');
        fillInputValue('location', 'Somewhere fancy');
        fillInputValue('departure', departureDate.toFormat('yyyy-MM-dd'));
        const mockEntryId = 2;
        const mockEntry = {
            name: 'Toronto',
            countryName: 'Canada',
            departureDate: departureDate.toISO(),
            temperature: 0,
            weatherIcon: 'test-icon',
            weatherDescription: 'Snow',
            imageUrl: 'test-image-url',
            latitude: 43.663,
            longitude: -79.384,
        };
        findGeocodesByPlaceName.mockReturnValue(Promise.resolve({
            name: mockEntry.name,
            countryName: mockEntry.countryName,
            latitude: mockEntry.latitude,
            longitude: mockEntry.longitude,
        }));
        getRecentWeatherForecast.mockReturnValue(Promise.resolve({
            temp: mockEntry.temperature,
            weather: {
                icon: mockEntry.weatherIcon,
                description: mockEntry.weatherDescription,
            },
        }));
        getPictureForPlace.mockReturnValue(Promise.resolve({
            webformatURL: mockEntry.imageUrl,
        }));
        saveEntry.mockReturnValue(Promise.resolve({
            ...mockEntry,
            id: mockEntryId,
        }));
        await addTripFormHandler(createMockFormEvent());
        expect(findGeocodesByPlaceName).toHaveBeenCalled();
        expect(getRecentWeatherForecast).toHaveBeenCalled();
        expect(getPictureForPlace).toHaveBeenCalled();
        expect(saveEntry).toHaveBeenCalledWith(mockEntry);

        const entryHolder = document.getElementById('entry-holder');
        expect(entryHolder.children.length).toBe(1);
        expect(entryHolder.children[0].dataset.entryId).toEqual(String(mockEntryId));
    });
});
