import { ApiException } from '../types/api'
import { ErrorIcon } from './Icons'

type ErrorMessageProps = {
  error: ApiException | Error | string | null
  className?: string
  onRetry?: () => void
}

export const ErrorMessage = ({ error, className = '', onRetry }: ErrorMessageProps) => {
  if (!error) return null

  const message =
    typeof error === 'string'
      ? error
      : error instanceof ApiException
        ? error.detail || error.message
        : error.message

  return (
    <div className={`bg-white border-2 border-black p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ErrorIcon />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-black">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-bold text-black hover:underline"
            >
              Попробовать снова
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
