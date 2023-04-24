import dotenv from 'dotenv';
import fastcsv from 'fast-csv';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import station from './models/station.model.js';
import { fileURLToPath } from 'url';
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

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
  console.log(error)
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, './csv');
const files = fs.readdirSync(directoryPath).filter(file => file.includes('deduplicated') && !file.includes('2021'));

let totalRowCount = 0;

database.on('connected', () => {
  console.log(color.yellowBright("\nStation database connected success!"));
  console.log(color.green("\nAdding to database ... \n"));
  console.time('Importing data to MongoDB took');

  files.forEach(file => {
    const outputFilePath = path.resolve(directoryPath, file);
    const stream = fs.createReadStream(outputFilePath);

    let csvData = [];
    let count = 0

    let csvStream = fastcsv
      // headers: true removes the first line of csv and ignoreEmpty ignores empty lines
      .parse({ headers: true, ignoreEmpty: true })
      .on("data", async (row) => {
        ++count
        csvData.push({
          ...row
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
        console.log(color.redBright(err))
      })
      .on("end", async (rowCount) => {
        await station.insertMany(csvData);
        totalRowCount += csvData.length;
        console.log(`Finished processing  ${color.green(rowCount)} rows from ${color.cyan(file)} \n`);
        // Close mongo connection and express
        database.once('close', () => {
          console.log(color.magenta("Database connection closed successfully.\n"));
        });
        console.timeEnd('Importing data to MongoDB took');
        database.close();
        server.close(() => console.log(color.magenta("\nServer closed successfully.\n")));
      });

    // Pipe the fs stream to fastcsv
    stream.pipe(csvStream);
  })
});

export default server;
