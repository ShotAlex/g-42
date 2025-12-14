import { useEffect, useState, useCallback, useRef } from 'react'

type UseTimerOptions = {
  startTime: string
  endTime: string
  onFinish?: () => void
  updateInterval?: number
}

type TimerState = {
  timeLeft: string
  status: 'before' | 'active' | 'finished'
  minutes: number
  seconds: number
}

export function useTimer({
  startTime,
  endTime,
  onFinish,
  updateInterval = 1000,
}: UseTimerOptions): TimerState {
  const [timeLeft, setTimeLeft] = useState('00:00')
  const [status, setStatus] = useState<'before' | 'active' | 'finished'>('before')
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  
  const onFinishRef = useRef(onFinish)
  const hasCalledOnFinishRef = useRef(false)

  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  const updateTimer = useCallback(() => {
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)

    if (now < start) {
      const diff = start.getTime() - now.getTime()
      const mins = Math.floor(diff / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      setMinutes(mins)
      setSeconds(secs)
      setTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
      setStatus('before')
      hasCalledOnFinishRef.current = false
    } else if (now >= start && now < end) {
      const diff = end.getTime() - now.getTime()
      const mins = Math.floor(diff / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      setMinutes(mins)
      setSeconds(secs)
      setTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
      setStatus('active')
      hasCalledOnFinishRef.current = false
    } else {
      setTimeLeft('00:00')
      setMinutes(0)
      setSeconds(0)
      setStatus('finished')
      if (!hasCalledOnFinishRef.current && onFinishRef.current) {
        hasCalledOnFinishRef.current = true
        onFinishRef.current()
      }
    }
  }, [startTime, endTime])

  useEffect(() => {
    updateTimer()
    const timerInterval = setInterval(updateTimer, updateInterval)
    return () => clearInterval(timerInterval)
  }, [updateTimer, updateInterval])

  return {
    timeLeft,
    status,
    minutes,
    seconds,
  }
}
