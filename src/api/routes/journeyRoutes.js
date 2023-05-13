import express from 'express';
import paginatedFetch from '../controllers/journey/paginateJourney.js';
import addJourney from '../controllers/journey/addJourney.js';

import journey from '../../lib/models/journey.model.js';

const journeyRoutes = express.Router();

// Journey
journeyRoutes.post('/search', paginatedFetch(journey));
journeyRoutes.post('/add', addJourney(journey));


export default journeyRoutes