import { useState, useEffect, useCallback, useRef } from 'react'
import { ApiException } from '../types/api'

type UseFetchOptions<T> = {
  fetchFn: () => Promise<T>
  enabled?: boolean
  refetchInterval?: number
  onSuccess?: (data: T) => void
  onError?: (error: ApiException) => void
}

type UseFetchResult<T> = {
  data: T | null
  loading: boolean
  error: ApiException | null
  refetch: () => Promise<void>
}

export function useFetch<T>({
  fetchFn,
  enabled = true,
  refetchInterval,
  onSuccess,
  onError,
}: UseFetchOptions<T>): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiException | null>(null)
  const hasLoadedRef = useRef(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const fetchFnRef = useRef(fetchFn)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  
  useEffect(() => {
    fetchFnRef.current = fetchFn
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError
  }, [fetchFn, onSuccess, onError])

  const fetchData = useCallback(async () => {
    if (!enabled) return

    try {
      setLoading(true)
      setError(null)
      const result = await fetchFnRef.current()
      setData(result)
      hasLoadedRef.current = true
      if (onSuccessRef.current) {
        onSuccessRef.current(result)
      }
    } catch (err) {
      const apiError =
        err instanceof ApiException
          ? err
          : new ApiException(
              err instanceof Error ? err.message : 'Неизвестная ошибка',
              500
            )
      setError(apiError)
      if (onErrorRef.current) {
        onErrorRef.current(apiError)
      }
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    if (!hasLoadedRef.current && enabled) {
      fetchData()
    }

    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(() => {
        fetchData()
      }, refetchInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchData, refetchInterval, enabled])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
