import { makeAutoObservable, runInAction } from 'mobx'
import { roundService } from '../services/RoundService'
import { type ApiException } from '../types/api'
import { type Round } from '../api/rounds'
import { toApiException } from '../utils/error'

class RoundsPageStore {
  createError: ApiException | null = null
  isCreating = false

  constructor() {
    makeAutoObservable(this)
  }

  async createRound(): Promise<Round | null> {
    runInAction(() => {
      this.createError = null
      this.isCreating = true
    })

    try {
      const newRound = await roundService.createRound()
      runInAction(() => {
        this.isCreating = false
      })
      return newRound
    } catch (err) {
      runInAction(() => {
        this.createError = toApiException(err, 'Не удалось создать раунд', 500)
        this.isCreating = false
      })
      return null
    }
  }

  clearError(): void {
    this.createError = null
  }

  reset(): void {
    this.createError = null
    this.isCreating = false
  }
}

export const roundsPageStore = new RoundsPageStore()
