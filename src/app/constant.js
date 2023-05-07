import axios from "axios"

export const API_URL = import.meta.env.REACT_APP_PROD_URL || 'http://localhost:3001'

export const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
