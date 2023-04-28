// const express = require('express');
import express from 'express';
import stationSearch from '../middleware/stationSearch.js';
import paginatedFetchingJourney from '../middleware/paginateJourney.js';
import paginatedFetchingStation from '../middleware/paginateStation.js';
import fetchStationDetails from '../middleware/stationDetails.js';
import journey from '../../lib/models/journey.model.js'
import station from '../../lib/models/station.model.js';


const router = express.Router();

router.post('/search', stationSearch);
router.post('/journey', paginatedFetchingJourney(journey));

router.get('/station', paginatedFetchingStation(station));
router.post('/station', paginatedFetchingStation(station));
router.post('/station-details', fetchStationDetails(journey));


export default router
