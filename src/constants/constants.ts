export const API_CONFIG = {
    BASE_URL: (import.meta.env?.API_BASE_URL as string | undefined) || 'http://v2991160.hosted-by-vdsina.ru/api/v1',
    TIMEOUT: 30000,
  } as const
  
  export const TIMING = {
    ROUNDS_REFRESH_INTERVAL: 5000,
    ROUND_REFRESH_INTERVAL: 2000,
    TAPS_BATCH_INTERVAL: 5000,
    
    TOKEN_REFRESH_BEFORE_EXPIRY: 60000,
    REQUEST_RETRY_DELAY: 1000,
    REQUEST_RETRY_MAX_ATTEMPTS: 3,
    
    TIMER_UPDATE_INTERVAL: 1000,
  } as const
  
  export const COOKIE_CONFIG = {
    TOKEN_EXPIRY_DAYS: 7,
    REFRESH_TOKEN_EXPIRY_DAYS: 30,
  } as const
  
  export const ROUND_CONFIG = {
    DEFAULT_ROUND_DURATION: 60000,
    ROUND_START_DELAY: 10000,
  } as const
  