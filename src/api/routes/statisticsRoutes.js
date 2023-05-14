import express from 'express';
import {
  basicStatistic,
  routeStatistic,
  stationStatistic,
} from '../controllers/statistics/statistics.js';

import journey from '../../lib/models/journey.model.js';

const statisticsRoutes = express.Router();

// Statistics
statisticsRoutes.post('/basic', basicStatistic(journey));
statisticsRoutes.post('/route', routeStatistic(journey));
statisticsRoutes.post('/station', stationStatistic(journey));

export default statisticsRoutes;
