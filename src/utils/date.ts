export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatTime(minutes: number, seconds: number): string {
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
