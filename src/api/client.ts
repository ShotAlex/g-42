import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getCookie, removeCookie } from '../utils/cookies'
import { API_CONFIG, TIMING } from '../constants/constants'
import { ApiException } from '../types/api'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (error?: unknown) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: API_CONFIG.TIMEOUT,
})

apiClient.interceptors.request.use((config) => {
  const token = getCookie('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  if (!config.signal) {
    const controller = new AbortController()
    config.signal = controller.signal
  }
  
  return config
})

const retryRequest = async (
  config: InternalAxiosRequestConfig,
  retryCount = 0
): Promise<unknown> => {
  try {
    return await axios(config)
  } catch (error) {
    if (retryCount < TIMING.REQUEST_RETRY_MAX_ATTEMPTS) {
      await new Promise((resolve) =>
        setTimeout(resolve, TIMING.REQUEST_RETRY_DELAY * (retryCount + 1))
      )
      return retryRequest(config, retryCount + 1)
    }
    throw error
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      removeCookie('token')
      removeCookie('refreshToken')
      processQueue(new Error('Unauthorized'), null)
      isRefreshing = false
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      
      return Promise.reject(error)
    }

    const responseData = error.response?.data as { message?: string; detail?: string } | undefined
    const apiError = new ApiException(
      responseData?.message || error.message || 'Неизвестная ошибка',
      error.response?.status || 500,
      responseData?.message ? { message: responseData.message, detail: responseData.detail } : undefined
    )

    return Promise.reject(apiError)
  }
)

export const apiRequest = async <T>(
  requestFn: () => Promise<T>,
  retryCount = 0
): Promise<T> => {
  try {
    return await requestFn()
  } catch (error) {
    if (retryCount < TIMING.REQUEST_RETRY_MAX_ATTEMPTS) {
      if (error instanceof ApiException && error.status === 401) {
        throw error
      }
      await new Promise((resolve) =>
        setTimeout(resolve, TIMING.REQUEST_RETRY_DELAY * (retryCount + 1))
      )
      return apiRequest(requestFn, retryCount + 1)
    }
    throw error
  }
}

