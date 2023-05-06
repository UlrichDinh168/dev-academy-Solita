import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './api/routes/router.js'
import { fileURLToPath } from 'url';
import { color } from 'console-log-colors';
dotenv.config();

const { PORT = 3001, DATABASE_URL } = process.env;

// Setup database connection
mongoose.connect(DATABASE_URL);
const database = mongoose.connection
database.on('error', (error) => {
  console.log(error)
});
database.on('connected', () => {
  console.log(color.yellowBright("\n Database connected success!"));
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// Middleware that parses json and looks at requests where the Content-Type header matches the type option.
app.use(express.json());
app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// Serve API requests from the router
app.use('/api', router);


// Serve app production bundle
app.use(express.static('dist/app'));
const root = path.join(__dirname, 'app/index.html')

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// if (process.env.NODE_ENV === 'production') {
app.get('*', (_req, res) => {
  res.sendFile(root);
});
// }


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

export default app;
