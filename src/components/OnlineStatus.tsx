import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { WarningIcon } from './Icons'

export const OnlineStatus = () => {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-2">
        <WarningIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Нет подключения к интернету</span>
      </div>
    </div>
  )
}
