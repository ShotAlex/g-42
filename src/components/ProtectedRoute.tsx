import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { authStore } from '../store/authStore'

type ProtectedRouteProps = {
  children: ReactNode
}

export const ProtectedRoute = observer(({ children }: ProtectedRouteProps) => {
  const isAuthenticated = authStore.isAuthenticated && !!authStore.user

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
})
