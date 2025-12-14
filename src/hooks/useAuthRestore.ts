import { useEffect } from 'react'
import { authStore } from '../store/authStore'
import { authService } from '../services/AuthService'

export function useAuthRestore() {
  useEffect(() => {
    if (authService.hasToken() && !authStore.user) {
      const token = authService.getToken()
      if (token) {
        authStore.setToken(token)
      }

      authService
        .restoreAuth()
        .then((user) => {
          if (user) {
            authStore.setUser(user)
          } else {
            authStore.logout()
          }
        })
        .catch(() => {
          authStore.logout()
        })
    }
  }, [])
}
