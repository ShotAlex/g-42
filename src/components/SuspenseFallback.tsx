import { LoadingSpinner } from './LoadingSpinner'

type SuspenseFallbackProps = {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export const SuspenseFallback = ({ text = 'Загрузка...', size = 'lg' }: SuspenseFallbackProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size={size} text={text} />
    </div>
  )
}
