import express from 'express';
import stationSearch from '../controllers/station/stationSearch.js';
import stationFetch from '../controllers/station/stationFetch.js';
import fetchStationDetails from '../controllers/station/stationDetails.js';

import addStation from '../controllers/station/addStation.js';

import journey from '../../lib/models/journey.model.js';
import station from '../../lib/models/station.model.js';


const stationRoutes = express.Router();

// Station
stationRoutes.get('/get', stationFetch(station));
stationRoutes.post('/search', stationSearch);
stationRoutes.post('/details', fetchStationDetails(journey));
stationRoutes.post('/add', addStation(station));


export default stationRoutes