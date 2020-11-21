export const getSavedEntries = async () => {
    const response = await fetch('/api/entries');
    if (!response.ok) {
        throw new Error(`HTTP Status: ${response.status}`);
    }
    return response.json();
};

export const saveEntry = async ({
    locationName,
    coordinates,
    temperature,
    departureDate,
    imageUrl,
}) => {
    const payload = {
        locationName,
        coordinates,
        temperature,
        departureDate,
        imageUrl,
    };
    const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error(`HTTP Status: ${response.status}`);
    }
    return response.json();
};

export const deleteEntry = async (id) => {
    if (!id) {
        throw new Error(`Missing required ID. ${id} found.`);
    }

    const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`HTTP Status: ${response.status}`);
    }
};
