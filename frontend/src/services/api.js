import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

async function get(path, config) {
  const res = await client.get(path, config)
  return res.data
}

async function post(path, body, config) {
  const res = await client.post(path, body, config)
  return res.data
}

export const api = { get, post, client }


