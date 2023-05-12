// const fs = require('fs');
// const express = require('express');
// const fastcsv = require('fast-csv');
// const path = require('path');
// const mongoose = require('mongoose');

// const journey = require('./models/journey.model.js');
// const { color } = require('console-log-colors');
// const dotenv = require('dotenv');
// const { validateData } = require('./utils/validateData.js');

import fs from 'fs';
import express from 'express';
import fastcsv from 'fast-csv';
import path from 'path';
import mongoose from 'mongoose';

import journey from './models/journey.model.js';
import { color } from 'console-log-colors';
import dotenv from 'dotenv';
import { validateData } from './utils/validateData.js';

dotenv.config();



// Initialize server for importing 
const app = express();
app.use(express.json());

const server = app.listen(8000, () => {
  console.log(`Server listening at port 8000`);
});

// ======================== =============================
const mongoString = process.env.DATABASE_URL
const directoryPath = path.join(__dirname, './csv');

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
  console.log(error)
})

const journeyFiles = fs.readdirSync(directoryPath).filter(file => file.includes('2021') && file.includes('deduplicated'));

let filesProcessed = 0;
let totalRowCount = 0;
let totalRemoveCount = 0;

/**
 * The file reads CSV files from a directory, 
 * validates the data in each file, and adds valid rows to the database. 
 * 
 * It also logs information about the import process to the console, 
 * including the number of rows imported and the number of invalid rows discarded. 
 */
database.on('connected', async () => {
  await journey.createIndexes([
    { key: { "Covered distance (m)": 1 } },
    { key: { "Duration (sec)": 1 } }
  ]);

  console.log(color.yellowBright("\nJourney database connected success!"));
  console.log(color.green("\nAdding to database ... \n"));
  console.time('Importing data to MongoDB took');

  journeyFiles.forEach(file => {
    const outputFilePath = path.resolve(directoryPath, file);
    const stream = fs.createReadStream(outputFilePath);

    let csvData = [];
    let counter = 0
    let remove = 0

    const csvStream = fastcsv
      .parse({ headers: true, ignoreEmpty: true })
      // .validate(journeyRow => parseInt(journeyRow['Covered distance (m)']) >= 10 && parseInt(journeyRow['Duration (sec)']) >= 10)
      .validate((journeyRow) => validateData(journeyRow)
      )
      .on("data", async (row) => {
        // Add the row to the current chunk of data
        ++counter
        csvData.push({
          ...row
        });
        if (counter >= 1000) {
          // Pause the CSV stream and insert the current chunk of data into MongoDB
          csvStream.pause();
          await journey.insertMany(csvData)
          totalRowCount += csvData.length;
          csvData = []; // set to empty to start another batch
          counter = 0;
          csvStream.resume();
        }
      })
      .on('data-invalid', () => ++remove)
      .on('error', function (err) {
        console.log(color.redBright(err))
      })
      .on("end", async (rowCount) => {
        await journey.insertMany(csvData);
        totalRowCount += csvData.length;
        totalRemoveCount += remove;
        filesProcessed++;

        console.log(`Finished processing ${color.green(rowCount)} rows from ${color.cyan(file)} with ${color.redBright(remove)} invalid rows.\n`);

        if (filesProcessed === journeyFiles.length) {
          console.log(`Totally added ${color.green(totalRowCount)} documents to mongo and removed ${color.redBright(totalRemoveCount)} invalid rows.\n`);
          database.once('close', () => {
            console.log(color.magenta("Database connection closed successfully.\n"));
          });
          console.timeEnd('Importing data to MongoDB took');
          database.close();
          server.close(() => console.log(color.magenta("\nServer closed successfully.\n")));
        }
      });

    stream.pipe(csvStream);
  });
})

export default server
// module.exports = server;
