import dotenv from 'dotenv';
import fastcsv from 'fast-csv';
import path from 'path';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import journey from './models/journey.js';
import station from './models/station.js';
const { color } = require('console-log-colors');

dotenv.config();

// Initialize server for importing 
const app = express();
app.use(express.json());

const server = app.listen(8000, () => {
  console.log(`Server Started at ${8000}`)
});

// ======================== =============================
const mongoString = process.env.DATABASE_URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directoryPath = path.join(__dirname, './');

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
  console.log(error)
})
let filesProcessed = 0;
let totalRowCount = 0;
let totalDiscardCount = 0;

const journeyFiles = fs.readdirSync(directoryPath).filter(file => file.endsWith('.csv') && file.includes('2021'));
const stationFiles = fs.readdirSync(directoryPath).filter(file => file.endsWith('.csv') && !file.includes('2021'));

database.on('connected', () => {
  console.log(color.yellowBright("\nDatabase connected success!"));
  console.log("\nAdding to database ... \n");

  // Adding stations to DB
  stationFiles.forEach(file => {
    const outputFilePath = path.resolve(directoryPath, file);
    const stream = fs.createReadStream(outputFilePath);
    let csvData = [];
    let count = 0

    let csvStream = fastcsv
      .parse({ headers: true, ignoreEmpty: true })
      .on("data", async (data) => {
        ++count
        csvData.push({
          ...data
        });
        if (count >= 1000) {
          csvStream.pause();
          await station.insertMany(csvData)
          totalRowCount += csvData.length;
          csvData = [];
          count = 0;
          csvStream.resume();
        }
      }
      )
      .on('error', function (err) {
        console.log(err, '==> Error')
      })
      .on("end", async (rowCount) => {
        await station.insertMany(csvData);
        totalRowCount += csvData.length;
        console.log(`Finished processing ${color.green(rowCount)} rows from ${color.cyan(file)} \n`);
      });

    stream.pipe(csvStream);
  })

  // Adding journeys to DB
  journeyFiles.forEach(file => {
    const outputFilePath = path.resolve(directoryPath, file);
    const stream = fs.createReadStream(outputFilePath);

    let csvData = [];
    let count = 0
    let discard = 0

    const csvStream = fastcsv
      .parse({ headers: true, ignoreEmpty: true })
      .validate(data => parseInt(data['Duration (sec)']) >= 10 && parseInt(data['Covered distance (m)']) >= 10)
      .on("data", async (data) => {
        ++count
        csvData.push({
          ...data
        });
        if (count >= 1000) {
          csvStream.pause();
          await journey.insertMany(csvData)
          totalRowCount += csvData.length;
          csvData = [];
          count = 0;
          csvStream.resume();
        }
      })
      .on('data-invalid', () => ++discard)
      .on('error', function (err) {
        console.log(err, '==> Error')
      })
      .on("end", async (rowCount) => {
        await journey.insertMany(csvData);
        totalRowCount += csvData.length;
        totalDiscardCount += discard;
        console.log(`Finished processing  ${color.green(rowCount)} rows from ${color.cyan(file)} with ${color.yellowBright(discard)} invalid rows.\n`);
        filesProcessed++;

        if (filesProcessed === journeyFiles.length) {
          console.log(`==> Added ${color.green(totalRowCount)} documents to mongo and discarded: ${color.yellowBright(totalDiscardCount)} rows.`);
          database.once('close', () => {
            console.log("Database connection closed successfully.");
          });
          database.close();
          server.close(() => console.log("Server closed successfully."));
        }

        // database.close()
        // server.close()
      });

    stream.pipe(csvStream);
  });
})


export default server;
