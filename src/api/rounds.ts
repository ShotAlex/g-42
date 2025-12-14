import { apiClient, apiRequest } from './client'
import { RoundStatus } from '../types/rounds'

export type Round = {
  id: string
  startTime: string
  endTime: string
  totalScore: number
  createdAt: string
}

export type RoundsResponse = {
  data: Round[]
  pagination: {
    limit: number
    nextCursor: string | null
    hasMore: boolean
  }
}

export type RoundDetailResponse = {
  round: Round
  topStats: Array<{
    taps: number
    score: number
    user: {
      username: string
    }
  }>
  myStats: {
    taps: number
    score: number
  }
}

export type CreateRoundRequest = {
  startTime: string
  endTime: string
}

export type TapResponse = {
  taps: number
  score: number
}

export function getRoundStatus(round: Round): RoundStatus {
  const now = new Date()
  const start = new Date(round.startTime)
  const end = new Date(round.endTime)

  if (now < start) {
    return RoundStatus.COOLDOWN
  } else if (now >= start && now < end) {
    return RoundStatus.ACTIVE
  } else {
    return RoundStatus.FINISHED
  }
}

export const roundsApi = {
  getRounds: async (params?: {
    cursor?: string
    limit?: number
    status?: RoundStatus
  }): Promise<RoundsResponse> => {
    return apiRequest(async () => {
      const response = await apiClient.get<RoundsResponse>('/rounds', { params })
      return response.data
    })
  },

  getRound: async (roundId: string): Promise<RoundDetailResponse> => {
    return apiRequest(async () => {
      const response = await apiClient.get<RoundDetailResponse>(`/rounds/${roundId}`)
      return response.data
    })
  },

  createRound: async (data: CreateRoundRequest): Promise<Round> => {
    return apiRequest(async () => {
      const response = await apiClient.post<Round>('/rounds', data)
      return response.data
    })
  },

  tap: async (roundId: string): Promise<TapResponse> => {
    return apiRequest(async () => {
      const response = await apiClient.post<TapResponse>(`/rounds/${roundId}/tap`)
      return response.data
    })
  },
}

