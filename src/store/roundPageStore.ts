import { makeAutoObservable, runInAction } from 'mobx'
import { roundService } from '../services/RoundService'
import { type RoundDetailResponse } from '../api/rounds'
import { RoundStatus } from '../types/rounds'
import { ApiException } from '../types/api'
import { toApiException } from '../utils/error'

class RoundPageStore {
  roundData: RoundDetailResponse | null = null
  error: ApiException | null = null
  loading = true
  isSendingTaps = false
  localTaps = 0
  hasLoadedFinalData = false
  abortController: AbortController | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async loadRound(roundId: string, isFinal = false): Promise<void> {
    if (this.abortController) {
      this.abortController.abort()
    }

    const controller = new AbortController()
    this.abortController = controller

    try {
      runInAction(() => {
        this.error = null
      })

      const data = await roundService.getRound(roundId)

      if (controller.signal.aborted) {
        return
      }

      runInAction(() => {
        this.roundData = data
        
        if (data.myStats) {
          this.localTaps = data.myStats.taps
        }

        if (isFinal) {
          this.hasLoadedFinalData = true
        }
      })
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }

      runInAction(() => {
        this.error = toApiException(err, 'Ошибка загрузки раунда', 500)
        console.error('Ошибка загрузки раунда:', err)
      })
    } finally {
      if (!controller.signal.aborted) {
        runInAction(() => {
          this.loading = false
        })
      }
    }
  }

  async handleRoundFinish(roundId: string): Promise<void> {
    if (this.hasLoadedFinalData) {
      return
    }

    while (this.isSendingTaps) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    this.hasLoadedFinalData = true

    try {
      await this.loadRound(roundId, true)
    } catch (err) {
      console.error('Ошибка при завершении раунда:', err)
      runInAction(() => {
        this.hasLoadedFinalData = false
      })
    }
  }

  async handleTap(roundId: string): Promise<void> {
    if (!this.isActive() || this.isSendingTaps) {
      return
    }

    runInAction(() => {
      this.localTaps += 1
      this.isSendingTaps = true
    })

    try {
      const response = await roundService.tap(roundId)
      
      runInAction(() => {
        this.localTaps = response.taps
        if (this.roundData) {
          this.roundData.myStats.taps = response.taps
          this.roundData.myStats.score = response.score
        }
      })
    } catch (err) {
      runInAction(() => {
        this.localTaps = Math.max(0, this.localTaps - 1)
        this.error = toApiException(err, 'Ошибка регистрации тапа', 500)
        console.error('Ошибка регистрации тапа:', err)
      })
    } finally {
      runInAction(() => {
        this.isSendingTaps = false
      })
    }
  }

  getStatus(): RoundStatus | null {
    if (!this.roundData?.round) {
      return null
    }
    return roundService.getRoundStatus(this.roundData.round)
  }

  isActive(): boolean {
    return this.getStatus() === RoundStatus.ACTIVE
  }

  isFinished(): boolean {
    return this.getStatus() === RoundStatus.FINISHED
  }

  isCooldown(): boolean {
    return this.getStatus() === RoundStatus.COOLDOWN
  }

  getDisplayTaps(): number {
    if (this.isActive()) {
      return this.localTaps
    }
    return this.roundData?.myStats.taps || 0
  }

  abortRequest(): void {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }

  reset(): void {
    this.abortRequest()
    this.roundData = null
    this.error = null
    this.loading = true
    this.isSendingTaps = false
    this.localTaps = 0
    this.hasLoadedFinalData = false
  }
}

export const roundPageStore = new RoundPageStore()
