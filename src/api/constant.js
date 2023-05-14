import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const digitransitAPI = axios.create({
  baseURL: 'https://api.digitransit.fi',
  headers: {
    'Content-Type': 'application/json',
    'digitransit-subscription-key': process.env.DIGITRANSIT_KEY,
  },
});

export { digitransitAPI };
