import { roundsApi, type Round, type RoundDetailResponse, type CreateRoundRequest, getRoundStatus } from '../api/rounds'
import { RoundStatus } from '../types/rounds'
import { ROUND_CONFIG } from '../constants/constants'
import { ApiException } from '../types/api'
import { validators, validate } from '../utils/validation'

class RoundService {
  async getRounds(params?: {
    cursor?: string
    limit?: number
    status?: RoundStatus
  }): Promise<{ data: Round[]; pagination: { limit: number; nextCursor: string | null; hasMore: boolean } }> {
    try {
      const response = await roundsApi.getRounds(params)
      return response
    } catch (error) {
      console.error('Ошибка получения списка раундов:', error)
      throw error
    }
  }

  async getRound(roundId: string): Promise<RoundDetailResponse> {
    const validation = validate(roundId, [
      {
        validator: validators.uuid,
        message: 'Неверный формат ID раунда',
      },
    ])

    if (!validation.isValid) {
      const error = new ApiException(validation.errors[0] || 'Неверный формат ID раунда', 400)
      throw error
    }

    try {
      const data = await roundsApi.getRound(roundId)
      return data
    } catch (error) {
      console.error('Ошибка получения данных раунда:', error)
      throw error
    }
  }

  async createRound(
    startDelay: number = ROUND_CONFIG.ROUND_START_DELAY,
    duration: number = ROUND_CONFIG.DEFAULT_ROUND_DURATION
  ): Promise<Round> {
    try {
      const now = new Date()
      const startTime = new Date(now.getTime() + startDelay)
      const endTime = new Date(startTime.getTime() + duration)

      const request: CreateRoundRequest = {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      }

      const round = await roundsApi.createRound(request)
      return round
    } catch (error) {
      console.error('Ошибка создания раунда:', error)
      throw error
    }
  }

  async tap(roundId: string): Promise<{ taps: number; score: number }> {
    const validation = validate(roundId, [
      {
        validator: validators.uuid,
        message: 'Неверный формат ID раунда',
      },
    ])

    if (!validation.isValid) {
      const error = new ApiException(validation.errors[0] || 'Неверный формат ID раунда', 400)
      throw error
    }

    try {
      const response = await roundsApi.tap(roundId)
      return response
    } catch (error) {
      console.error('Ошибка регистрации тапа:', error)
      throw error
    }
  }

  async tapMultiple(roundId: string, count: number): Promise<{ taps: number; score: number }> {
    if (count <= 0) {
      throw new ApiException('Количество тапов должно быть больше 0', 400)
    }

    let lastResponse = { taps: 0, score: 0 }

    try {
      for (let i = 0; i < count; i++) {
        lastResponse = await this.tap(roundId)
      }

      return lastResponse
    } catch (error) {
      console.error(`Ошибка регистрации ${count} тапов:`, error)
      throw error
    }
  }

  getRoundStatus(round: Round): RoundStatus {
    return getRoundStatus(round)
  }

  isRoundActive(round: Round): boolean {
    return this.getRoundStatus(round) === RoundStatus.ACTIVE
  }

  isRoundFinished(round: Round): boolean {
    return this.getRoundStatus(round) === RoundStatus.FINISHED
  }

  isRoundCooldown(round: Round): boolean {
    return this.getRoundStatus(round) === RoundStatus.COOLDOWN
  }
}

export const roundService = new RoundService()
