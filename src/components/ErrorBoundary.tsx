import { Component, type ReactNode, type ErrorInfo } from 'react'
import { ErrorMessage } from './ErrorMessage'
import { ApiException } from '../types/api'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const apiError =
        this.state.error instanceof ApiException
          ? this.state.error
          : new ApiException(
              this.state.error?.message || 'Произошла непредвиденная ошибка',
              500
            )

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <ErrorMessage
              error={apiError}
              onRetry={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
            />
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
