// const express = require('express');
import express from 'express';
import journeySearch from '../middleware/journeySearch.js';
import paginatedFetching from '../middleware/paginatedFetching.js';
import journey from '../../lib/models/journey.model.js'


const router = express.Router();

router.post('/search', journeySearch);
router.post('/journey', paginatedFetching(journey));


export default router
