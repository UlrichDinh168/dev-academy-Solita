import axios from "axios"

// export const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001'
// export const API_URL = 'http://localhost:3001'
export const API_URL = 'http://ec2-44-211-78-150.compute-1.amazonaws.com:3001/'

export const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})


export const digitransitAPI = axios.create({
  baseURL: 'https://api.digitransit.fi',
  headers: {
    'Content-Type': 'application/json',
    'digitransit-subscription-key': '486aab41f80e491e9068ec79e3a3f30d',
  },
});
