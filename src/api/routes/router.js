// const express = require('express');
// const stationSearch = require('../controllers/stationSearch.js');
// const paginatedJourneyFetch = require('../controllers/paginateJourney.js');
// const stationFetch = require('../controllers/stationFetch.js');
// const fetchStationDetails = require('../controllers/stationDetails.js');

// const stationSearchExtented = require('../controllers/stationSearchExtented.js');
// const calculateRoute = require('../controllers/calculateRoute.js');
// const { basicStatistic, routeStatistic, stationStatistic } = require('../controllers/statistic.js');
// const addJourney = require('../controllers/addJourney.js');
// const addStation = require('../controllers/addStation.js');

// const journey = require('../../lib/models/journey.model.js');
// const station = require('../../lib/models/station.model.js');
// const getAddressLookup = require('../controllers/addressLookup.js');

import express from 'express';
import stationSearch from '../controllers/stationSearch.js';
import paginatedJourneyFetch from '../controllers/paginateJourney.js';
import stationFetch from '../controllers/stationFetch.js';
import fetchStationDetails from '../controllers/stationDetails.js';

import stationSearchExtented from '../controllers/stationSearchExtented.js';
import calculateRoute from '../controllers/calculateRoute.js';
import { basicStatistic, routeStatistic, stationStatistic } from '../controllers/statistic.js';
import addJourney from '../controllers/addJourney.js';
import addStation from '../controllers/addStation.js';

import journey from '../../lib/models/journey.model.js';
import station from '../../lib/models/station.model.js';
import getAddressLookup from '../controllers/addressLookup.js';


const router = express.Router();

// Station
router.get('/get-station', stationFetch(station));
router.post('/station-search', stationSearch);
router.post('/station-search-ext', stationSearchExtented);
router.post('/station-details', fetchStationDetails(journey));
router.post('/add-station', addStation(station));
router.post('/address-lookup', getAddressLookup);


// Journey
router.post('/get-journey', paginatedJourneyFetch(journey));
router.post('/add-journey', addJourney(journey));
router.post('/get-routes', calculateRoute);


// Statistics
router.post('/statistic-basic', basicStatistic(journey));
router.post('/statistic-route', routeStatistic(journey));
router.post('/statistic-station', stationStatistic(journey));


// module.exports = router;
export default router