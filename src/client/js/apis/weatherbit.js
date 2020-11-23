import { DateTime, Interval } from 'luxon';

export const WEATHERBIT_API_BASE = 'https://api.weatherbit.io/v2.0';

/**
 * Return a weather forecast within "daysLater" days.
 * Assume 0 <= daysLater < 16
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} daysLater
 */
export const getRecentWeatherForecast = async (latitude, longitude, daysLater) => {
    const params = new URLSearchParams({
        key: process.env.WEATHERBIT_API_KEY,
        lat: latitude,
        lon: longitude,
    });
    const url = `${WEATHERBIT_API_BASE}/forecast/daily?${params}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`[Weatherbit] HTTP Status: ${response.status}`);
    }

    const result = await response.json();
    const weather = result.data[daysLater];
    return weather;
};

const getHistoricalDate = (futureDate) => {
    const now = DateTime.local();
    const duration = Interval.fromDateTimes(now, futureDate);
    return futureDate.minus({ years: duration.years + 1 });
};

/**
 * Predict the weather of a future date that is more than 16 days later from historical data.
 * @param {Number} latitude
 * @param {Number} longitude
 * @param {DateTime} futureDate assuming this is a luxon DateTime object
 */
export const getPredictedWeatherFromHistoricalData = async (latitude, longitude, futureDate) => {
    const historicalDate = getHistoricalDate(futureDate);
    const endDate = historicalDate.plus({ days: 1 });
    const params = new URLSearchParams({
        key: process.env.WEATHERBIT_API_KEY,
        lat: latitude,
        lon: longitude,
        start_date: historicalDate.toFormat('YYYY-MM-DD'),
        end_date: endDate.toFormat('YYYY-MM-DD'),
    });
    const url = `${WEATHERBIT_API_BASE}/history/daily?${params}`;
    const response = fetch(url);

    if (!response.ok) {
        throw new Error(`Weatherbit: HTTP Status: ${response.status}`);
    }

    const result = await response.json();
    return result.data[0];
};
