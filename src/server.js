const express = require("express");
const { color } = require('console-log-colors');
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

const router = require('./api/routes/router');

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
