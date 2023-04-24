import dotenv from 'dotenv';
import fastcsv from 'fast-csv';
import path from 'path';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import journey from './models/journey.model.js';
import { color } from 'console-log-colors';

dotenv.config();

// Initialize server for importing 
const app = express();
app.use(express.json());

const server = app.listen(8000, () => {
  console.log(`Server listening at port 8000`);
});

// ======================== =============================
const mongoString = process.env.DATABASE_URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directoryPath = path.join(__dirname, './csv');

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
  console.log(error)
})

const journeyFiles = fs.readdirSync(directoryPath).filter(file => file.endsWith('.csv') && file.includes('2021'));

let filesProcessed = 0;
let totalRowCount = 0;
let totalDiscardCount = 0;

database.on('connected', () => {
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
      .validate(journeyRow => parseInt(journeyRow['Covered distance (m)']) >= 10 && parseInt(journeyRow['Duration (sec)']) >= 10)
      .on("data", async (row) => {
        ++counter
        csvData.push({
          ...row
        });
        if (counter >= 1000) {
          csvStream.pause();
          await journey.insertMany(csvData)
          totalRowCount += csvData.length;
          csvData = [];
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
        totalDiscardCount += remove;
        filesProcessed++;
        console.log(`Finished processing ${color.green(rowCount)} rows from ${color.cyan(file)} with ${color.redBright(remove)} invalid rows.\n`);

        if (filesProcessed === journeyFiles.length) {
          console.log(`Totally added ${color.green(totalRowCount)} documents to mongo and removed ${color.redBright(totalDiscardCount)} invalid rows.\n`);
          database.once('close', () => {
            console.log(color.magenta("Database connection closed successfully.\n"));
          });
          console.timeEnd('Importing data to MongoDB took');
          database.close();
          server.close(() => console.log(color.magenta("\nServer closed successfully.\n")));
        }
        // database.close()
        // server.close()
      });

    stream.pipe(csvStream);
  });
})


export default server;
