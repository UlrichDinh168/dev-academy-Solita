// const axios = require('axios')
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.DIGITRANSIT_KEY, 'process.env.DIGITRANSIT_KEY');

const digitransitAPI = axios.create({
  baseURL: 'https://api.digitransit.fi',
  headers: {
    'Content-Type': 'application/json',
    'digitransit-subscription-key': process.env.DIGITRANSIT_KEY,
  },
});


// module.exports = { digitransitAPI }
export { digitransitAPI }
