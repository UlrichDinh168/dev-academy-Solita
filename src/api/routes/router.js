const express = require('express');
const stationSearch = require('../controllers/stationSearch.js');
const paginatedFetchingJourney = require('../controllers/paginateJourney.js');
const paginatedFetchingStation = require('../controllers/paginateStation.js');
const fetchStationDetails = require('../controllers/stationDetails.js');
const stationSearchExtented = require('../controllers/stationSearchExtented.js');
const calculateRoute = require('../controllers/calculateRoute.js');

const addJourney = require('../controllers/addJourney.js');
const addStation = require('../controllers/addStation.js');

const journey = require('../../lib/models/journey.model.js');
const station = require('../../lib/models/station.model.js');

const router = express.Router();

router.post('/search', stationSearch);
router.post('/journey', paginatedFetchingJourney(journey));

router.get('/station', paginatedFetchingStation(station));
router.post('/station', paginatedFetchingStation(station));
router.post('/search-ext', stationSearchExtented);

router.post('/station-details', fetchStationDetails(journey));
router.post('/get-routes', calculateRoute);

router.post('/add-journey', addJourney(journey));
router.post('/add-station', addStation(station));

module.exports = router;