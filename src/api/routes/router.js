// const express = require('express');
import express from 'express';
import journeySearch from '../middleware/journeySearch.js';
const router = express.Router();

router.post('/search', journeySearch);


export default router
