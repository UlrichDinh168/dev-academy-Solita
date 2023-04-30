// const express = require('express');
import express from 'express';

import stationSearch from '../controllers/stationSearch.js';
import paginatedFetchingJourney from '../controllers/paginateJourney.js';
import paginatedFetchingStation from '../controllers/paginateStation.js';
import fetchStationDetails from '../controllers/stationDetails.js';
import addJourney from '../controllers/addJourney.js'
import addStation from '../controllers/addStation.js'

import journey from '../../lib/models/journey.model.js'
import station from '../../lib/models/station.model.js';


const router = express.Router();

router.post('/search', stationSearch);
router.post('/journey', paginatedFetchingJourney(journey));

router.get('/station', paginatedFetchingStation(station));
router.post('/station', paginatedFetchingStation(station));
router.post('/station-details', fetchStationDetails(journey));

router.post('/add-journey', addJourney(journey));
router.post('/add-station', addStation(station));

export default router
