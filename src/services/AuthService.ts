import { authApi, type User, type LoginResponse } from '../api/auth'
import { setCookie, removeCookie, getCookie } from '../utils/cookies'
import { COOKIE_CONFIG } from '../constants/constants'

class AuthService {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await authApi.login(username, password)

      setCookie('token', response.token, COOKIE_CONFIG.TOKEN_EXPIRY_DAYS)
      if (response.refreshToken) {
        setCookie('refreshToken', response.refreshToken, COOKIE_CONFIG.REFRESH_TOKEN_EXPIRY_DAYS)
      } else {
        removeCookie('refreshToken')
      }

      return response
    } catch (error) {
      console.error('Ошибка входа:', error)
      throw error
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const user = await authApi.getCurrentUser()
      return user
    } catch (error) {
      console.error('Ошибка получения данных пользователя:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      await authApi.logout()
    } catch (error) {
    } finally {
      this.clearTokens()
    }
  }

  clearTokens(): void {
    removeCookie('token')
    removeCookie('refreshToken')
  }

  getToken(): string | null {
    return getCookie('token')
  }

  getRefreshToken(): string | null {
    return getCookie('refreshToken')
  }

  hasToken(): boolean {
    return this.getToken() !== null
  }

  async restoreAuth(): Promise<User | null> {
    const token = this.getToken()
    if (!token) {
      return null
    }

    try {
      const user = await this.getCurrentUser()
      return user
    } catch (error) {
      this.clearTokens()
      return null
    }
  }
}

export const authService = new AuthService()
