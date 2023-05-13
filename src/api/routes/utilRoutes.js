import express from 'express';
import stationSearchExtented from '../controllers/stationSearchExtented.js';
import calculateRoute from '../controllers/calculateRoute.js';
import getAddressLookup from '../controllers/addressLookup.js';


const utilRoutes = express.Router();

// Utility routes
utilRoutes.post('/address-search', stationSearchExtented);
utilRoutes.post('/address-lookup', getAddressLookup);
utilRoutes.post('/journey-calc', calculateRoute);

export default utilRoutes