const axios = require('axios')

const digitransitAPI = axios.create({
  baseURL: 'https://api.digitransit.fi',
  headers: {
    'Content-Type': 'application/json',
    'digitransit-subscription-key': process.env.DIGITRANSIT_KEY,
  },
});


module.exports = { digitransitAPI }