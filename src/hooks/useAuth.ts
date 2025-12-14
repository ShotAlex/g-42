import { useMemo } from 'react'
import { authStore } from '../store/authStore'

export function useAuth() {
  const username = useMemo(() => authStore.user?.username, [authStore.user?.username])
  const role = useMemo(() => authStore.user?.role, [authStore.user?.role])
  const isAuthenticated = useMemo(() => authStore.isAuthenticated, [authStore.isAuthenticated])
  const isAdmin = useMemo(() => authStore.user?.role === 'ADMIN', [authStore.user?.role])
  const user = useMemo(() => authStore.user, [authStore.user])

  return {
    username,
    role,
    isAuthenticated,
    isAdmin,
    user,
  }
}
