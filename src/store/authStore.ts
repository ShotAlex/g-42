import { makeAutoObservable, runInAction } from 'mobx'
import { type User } from '../api/auth'
import { authService } from '../services/AuthService'
import { debounce } from '../utils/debounce'

class AuthStore {
  user: User | null = null
  token: string | null = null
  refreshToken: string | null = null
  isAuthenticated = false

  constructor() {
    makeAutoObservable(this)
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('auth-storage')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.state) {
          this.user = parsed.state.user
          this.isAuthenticated = parsed.state.isAuthenticated || false

          const tokenFromCookie = authService.getToken()
          if (tokenFromCookie) {
            this.token = tokenFromCookie
          }
        }
      }
    } catch (error) {
    }
  }

  private saveToStorage = debounce(() => {
    try {
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: {
            user: this.user,
            isAuthenticated: this.isAuthenticated,
          },
        })
      )
    } catch (error) {
    }
  }, 300)

  async login(username: string, password: string): Promise<void> {
    try {
      const response = await authService.login(username, password)

      runInAction(() => {
        this.token = response.token
        this.refreshToken = response.refreshToken || null
        this.user = {
          username: response.username,
          role: response.role,
        }
        this.isAuthenticated = true
      })

      this.saveToStorage()

      try {
        localStorage.setItem(
          'auth-storage',
          JSON.stringify({
            state: {
              user: this.user,
              isAuthenticated: this.isAuthenticated,
            },
          })
        )
      } catch (error) {
      }
    } catch (error) {
      throw error
    }
  }

  async logout(): Promise<void> {
    await authService.logout()

    runInAction(() => {
      this.user = null
      this.token = null
      this.refreshToken = null
      this.isAuthenticated = false
      this.saveToStorage()
    })
  }

  setUser(user: User): void {
    runInAction(() => {
      this.user = user
      this.isAuthenticated = true
      this.saveToStorage()
    })
  }

  setToken(token: string): void {
    runInAction(() => {
      this.token = token
    })
  }

  setIsAuthenticated(value: boolean): void {
    runInAction(() => {
      this.isAuthenticated = value
      this.saveToStorage()
    })
  }
}

export const authStore = new AuthStore()
