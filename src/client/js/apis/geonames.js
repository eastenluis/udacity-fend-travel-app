export const GEONAMES_API_BASE = 'http://api.geonames.org/searchJSON';

export const findGeocodesByPlaceName = async (placeName) => {
    const url = `${GEONAMES_API_BASE}?q=${encodeURIComponent(placeName)}&username=${encodeURIComponent(process.env.GEONAMES_USERNAME)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`[Geonames] HTTP Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.geonames.length === 0) {
        return null;
    }

    const {
        name, countryName, lat, lng,
    } = data.geonames[0];
    return {
        name,
        countryName,
        latitude: lat,
        longitude: lng,
    };
};
