import axios from "axios"

export const REACT_APP_API_URL = 'http://localhost:3001'
const REACT_APP_PROD_ENV = 'https://solita-dev-ulrich.herokuapp.com/'

export const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? REACT_APP_PROD_ENV : REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
