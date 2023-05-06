const axios = require('axios')


const digitransitAPI = axios.create({
  baseURL: 'https://api.digitransit.fi',
  headers: {
    'Content-Type': 'application/json',
    'digitransit-subscription-key': '486aab41f80e491e9068ec79e3a3f30d',
  },
});


module.exports = { digitransitAPI }