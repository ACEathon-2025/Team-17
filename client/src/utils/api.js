// client/src/utils/api.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance with longer timeout and retry logic
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased to 60 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request queue and rate limiting
let requestQueue = []
let isProcessingQueue = false
const MAX_REQUESTS_PER_SECOND = 5
const REQUEST_DELAY = 1000 / MAX_REQUESTS_PER_SECOND

// Process request queue to prevent rate limiting
const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return

  isProcessingQueue = true

  while (requestQueue.length > 0) {
    const { config, resolve, reject } = requestQueue.shift()

    try {
      const response = await axios(config)
      resolve(response)
    } catch (error) {
      reject(error)
    }

    // Wait before processing next request
    if (requestQueue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY))
    }
  }

  isProcessingQueue = false
}

// Request interceptor to add auth token and queue requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // Handle 429 Rate Limit with retry
    if (error.response?.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true

      // Add to queue and process
      return new Promise((resolve, reject) => {
        requestQueue.push({ config: originalRequest, resolve, reject })
        processQueue()
      })
    }

    // Handle network errors with retry
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          api(originalRequest)
            .then(resolve)
            .catch(reject)
        }, 2000) // Retry after 2 seconds
      })
    }

    return Promise.reject(error)
  }
)

// Utility function for safe API calls with caching
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const cachedApiCall = async (key, apiCall, options = {}) => {
  const { force = false, cacheDuration = CACHE_DURATION } = options

  // Check cache
  if (!force && cache.has(key)) {
    const { data, timestamp } = cache.get(key)
    if (Date.now() - timestamp < cacheDuration) {
      return data
    }
  }

  try {
    const response = await apiCall()
    cache.set(key, { data: response.data, timestamp: Date.now() })
    return response.data
  } catch (error) {
    // Return cached data if available on error
    if (cache.has(key)) {
      console.warn('Using cached data due to API error')
      return cache.get(key).data
    }
    throw error
  }
}

// Clear cache utility
export const clearApiCache = (key) => {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}
