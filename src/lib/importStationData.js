import fs from 'fs';
import express from 'express';
import fastcsv from 'fast-csv';
import mongoose from 'mongoose';
import path from 'path';
import { color } from 'console-log-colors';
import station from './models/station.model.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// Initialize server for importing
const app = express();
app.use(express.json());

const server = app.listen(8000, () => {
  console.log(`Server listening at port 8000`);
});
// ======================== =============================

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, './csv');
const files = fs
  .readdirSync(directoryPath)
  .filter((file) => file.includes('csv') && !file.includes('2021'));

/**
 * Extendable version for importing station csv files to Mongo.
 * Applicable for future station files.
 *
 * The file reads CSV files from a directory,
 * limits the batch size of the insertMany() operation to 1000 to avoid memory overflow.
 */
database.on('connected', () => {
  console.log(color.yellowBright('\nStation database connected success!'));
  console.log(color.green('\nAdding to database ... \n'));
  console.time('Importing data to MongoDB took');

  files.forEach((file) => {
    const outputFilePath = path.resolve(directoryPath, file);
    const stream = fs.createReadStream(outputFilePath);

    let csvData = [];
    let count = 0;

    let csvStream = fastcsv
      .parse({ headers: true, ignoreEmpty: true })
      .on('data', async (row) => {
        ++count;
        csvData.push({
          ...row,
        });
        // Limit to 1k lines to avoid memory overflow
        if (count >= 1000) {
          csvStream.pause();
          await station.insertMany(csvData);
          csvData = [];
          count = 0;
          csvStream.resume();
        }
      })
      .on('error', function (err) {
        console.log(color.redBright(err));
      })
      .on('end', async (rowCount) => {
        await station.insertMany(csvData);

        console.log(
          `Finished processing  ${color.green(rowCount)} rows from ${color.cyan(file)} \n`
        );

        database.once('close', () => {
          console.log(color.magenta('Database connection closed successfully.\n'));
        });

        console.timeEnd('Importing data to MongoDB took');

        database.close();
        server.close(() => console.log(color.magenta('\nServer closed successfully.\n')));
      });

    // Pipe the fs stream to fastcsv
    stream.pipe(csvStream);
  });
});

export default server;
