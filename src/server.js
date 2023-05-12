// const express = require("express");
// const { color } = require('console-log-colors');
// const cors = require("cors");
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const router = require('./api/routes/router');

import express from "express";
import { color } from 'console-log-colors';
import cors from "cors";
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './api/routes/router.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();


// Set the default port for development

let port = process.env.PORT

const { DATABASE_URL } = process.env;

// Setup database connection
mongoose.connect(process.env.DATABASE_URL);
const database = mongoose.connection
database.on('error', (error) => {
  console.log(error)
});
database.on('connected', () => {
  console.log(color.yellowBright("\n Database connected success!"));
});

const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cookieParser());
app.use("/api", router);


const root = path.join(__dirname, "app");

app.use(express.static(root));
app.get("*", (req, res) => {
  res.sendFile("index.html", { root });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('app'))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./app", "index.html"));
  });
}


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// Start the server
// Override the port for testing
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`))
}

// module.exports = app
export default app
