import { apiClient, apiRequest } from './client'

export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  username: string
  role: 'SURVIVOR' | 'NIKITA' | 'ADMIN'
  token: string
  refreshToken?: string
}

export type User = {
  username: string
  role: 'SURVIVOR' | 'NIKITA' | 'ADMIN'
}

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    return apiRequest(async () => {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        username,
        password,
      })
      return response.data
    })
  },

  getCurrentUser: async (): Promise<User> => {
    return apiRequest(async () => {
      const response = await apiClient.get<User>('/auth/me')
      return response.data
    })
  },

  logout: async (): Promise<void> => {
    return apiRequest(async () => {
      await apiClient.post('/auth/logout')
    })
  },
}

