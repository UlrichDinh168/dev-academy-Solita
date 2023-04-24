import dotenv from 'dotenv';
import fastcsv from 'fast-csv';
import path from 'path';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import station from './models/station.js';
dotenv.config();

// Initialize server for importing 
const app = express();
app.use(express.json());

const server = app.listen(8000, () => {
  console.log(`Server Started at ${8000}`)
});

// ======================== =============================
const mongoString = process.env.DATABASE_URL

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
  console.log(error)
})

database.on('connected', () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const stream = fs.createReadStream(path.join(__dirname, 'test.csv'));

  let csvData = [];

  let csvStream = fastcsv
    .parse({ headers: true, })
    .on("data", (data) => {
      csvData.push({
        ...data
      });
    }
    )
    .on('error', function (err) {
      console.log(err, '==> Error <==')
    })
    .on("end", async () => {
      await station.insertMany(csvData);
      csvData = [];
      database.close()
      server.close(() => console.log("Server closed successfully."));
    });
  stream.pipe(csvStream);
});


export default server;
