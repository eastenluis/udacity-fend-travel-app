export const PIXABAY_API_BASE = 'https://pixabay.com/api/';

export const getPictureForPlace = async (place) => {
    const params = new URLSearchParams({
        key: process.env.PIXABAY_API_KEY,
        q: place,
        safesearch: true,
        per_page: 5,
        image_type: 'photo',
    });
    const url = `${PIXABAY_API_BASE}?${params}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`[Pixabay] HTTP Status: ${response.status}`);
    }

    const results = await response.json();
    if (!results.totalHits) {
        return null;
    }
    return results.hits[0];
};
