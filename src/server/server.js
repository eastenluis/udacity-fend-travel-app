// Setup empty JS object to act as endpoint for all routes
const projectData = {
    entryId: 0,
    entries: [],
};

// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Start up an instance of app
const app = express();

/* Middleware */
// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

/**
 *  GET /api/entries
 *  Get all searched travel entries
 */
app.get('/api/entries', (req, res) => {
    // Return a list of recent searched entries, as JSON array
    res.send(projectData.entries);
});

/**
 * POST /api/entries
 * Create a new search entry
 */
const getNewEntryId = () => {
    projectData.entryId += 1;
    return projectData.entryId;
};
const requiredFields = [
    'locationName',
    'coordinates',
    'temperature',
    'departureDate',
    'imageUrl',
];
app.post('/api/entries', (req, res) => {
    for (const field of requiredFields) {
        if (!req.body || !req.body[field]) {
            res.status(400).send(`Missing required field: "${field}"`);
            return;
        }
    }
    const {
        locationName,
        coordinates,
        temperature,
        departureDate,
        imageUrl,
    } = req.body;

    const newEntry = {
        id: getNewEntryId(),
        locationName,
        coordinates,
        temperature,
        departureDate,
        imageUrl,
    };
    projectData.entries.push(newEntry);
    res.status('201').send(newEntry);
});

/**
 * DELETE /api/entries/:id
 * Remove a specific entry
 */
app.delete('/api/entries/:entryId', (req, res) => {
    const { entryId } = req.params;
    const index = projectData.entries.findIndex((entry) => entry.id === entryId);
    if (index < 0) {
        res.status('404').end();
        return;
    }

    projectData.entries.splice(index, 1);
    res.status('200').end();
});

// Static web path
app.use(express.static('dist'));
app.get('/', (req, res) => {
    res.sendFile('/index.html');
});

// Start listening
const port = 8081;
app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
});