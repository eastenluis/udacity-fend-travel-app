const request = require('supertest');

const app = require('../server');

describe('Entry API', () => {
    it('creates, fetches and deletes entries', async () => {
        const mockRequestPayload = {
            name: 'Toronto',
            countryName: 'Canada',
            departureDate: '2020-01-01',
            temperature: 0,
            weatherIcon: 'test-icon',
            weatherDescription: 'Snow',
            imageUrl: 'test-image-url',
            latitude: 43.663,
            longitude: -79.384,
        };
        const newEntry = {
            ...mockRequestPayload,
            id: 1,
        };

        // Create new entry
        const postResponse = await request(app)
            .post('/api/entries')
            .send(mockRequestPayload)
            .expect(201);
        expect(postResponse.body).toEqual(newEntry);

        // Fetch existing entries
        let fetchResponse = await request(app)
            .get('/api/entries')
            .expect(200);
        expect(fetchResponse.body).toEqual([newEntry]);

        await request(app).delete(`/api/entries/${newEntry.id}`).expect(200);
        fetchResponse = await request(app).get('/api/entries');
        expect(fetchResponse.body).toHaveLength(0);
    });

    it.each([
        'name',
        'countryName',
        'departureDate',
        'temperature',
        'weatherIcon',
        'weatherDescription',
        'imageUrl',
        'latitude',
        'longitude',
    ])('returns 400 for missing argument %s', async (argument) => {
        const mockRequestPayload = {
            name: 'Toronto',
            countryName: 'Canada',
            departureDate: '2020-01-01',
            temperature: 0,
            weatherIcon: 'test-icon',
            weatherDescription: 'Snow',
            imageUrl: 'test-image-url',
            latitude: 43.663,
            longitude: -79.384,
        };
        delete mockRequestPayload[argument];
        await request(app)
            .post('/api/entries')
            .send(mockRequestPayload)
            .expect(400);
    });
});
