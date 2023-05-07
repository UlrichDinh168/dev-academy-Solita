import axios from "axios"

export const API_URL = import.meta.env.REACT_APP_PROD_URL || 'http://localhost:3001'

export const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? REACT_APP_PROD_ENV : REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
