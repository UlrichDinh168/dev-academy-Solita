import axios from "axios"

export const API_URL = import.meta.env.REACT_APP_PROD_URL || 'http://localhost:3001'
export const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? import.meta.env.REACT_APP_PROD_URL : 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})
