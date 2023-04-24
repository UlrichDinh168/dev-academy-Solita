// const path = require('path');
import path from 'path'
// const express = require('express');
// const router = require('./api/router');
import express from 'express';
import router from './api/routes/router.js'
import { fileURLToPath } from 'url';

const { PORT = 3001 } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname, '__dirname');
const app = express();

// Middleware that parses json and looks at requests where the Content-Type header matches the type option.
app.use(express.json());

// Serve API requests from the router
app.use('/api', router);


// Serve app production bundle
app.use(express.static('dist/app'));
const root = path.join(__dirname, 'app/index.html')
// Handle client routing, return all requests to the app

// if (process.env.NODE_ENV === 'production') {
app.get('*', (_req, res) => {
  res.sendFile(root);
});
// }


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
