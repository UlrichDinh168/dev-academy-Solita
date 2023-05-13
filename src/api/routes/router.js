import express from 'express';
import stationRoutes from './stationRoutes.js';
import journeyRoutes from './journeyRoutes.js';
import statisticsRoutes from './statisticsRoutes.js';
import utilRoutes from './utilRoutes.js';


const router = express.Router();

router.get('/', (req, res) => {
  res.send('Fron Router API')
}).use("/station", stationRoutes)
  .use("/journey", journeyRoutes)
  .use("/statistics", statisticsRoutes)
  .use("/", utilRoutes)


export default router