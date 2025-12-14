import { useEffect, useCallback, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { useParams, useNavigate } from 'react-router-dom'
import { roundPageStore } from '../store/roundPageStore'
import { useTimer } from '../hooks/useTimer'
import { useAuth } from '../hooks/useAuth'
import { TIMING } from '../constants/constants'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { PageHeader } from '../components/PageHeader'
import { RoundStatusDisplay } from '../components/round/RoundStatusDisplay'
import { RoundNavigation } from '../components/round/RoundNavigation'
import { GooseGraphic } from '../components/GooseGraphic'

const RoundPage = observer(() => {
  const { roundId } = useParams<{ roundId: string }>()
  const navigate = useNavigate()
  const { username } = useAuth()

  const hasInitializedRef = useRef(false)

  useEffect(() => {
    if (!roundId) {
      navigate('/rounds')
      return
    }

    if (hasInitializedRef.current) {
      roundPageStore.reset()
    }

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true
      roundPageStore.loadRound(roundId, false)
    }

    return () => {
      roundPageStore.abortRequest()
      if (roundId && roundPageStore.isActive()) {
      }
      hasInitializedRef.current = false
    }
  }, [roundId, navigate])

  const round = roundPageStore.roundData?.round
  const status = roundPageStore.getStatus()
  const isFinished = roundPageStore.isFinished()
  const isCooldown = roundPageStore.isCooldown()
  const isActive = roundPageStore.isActive()

  const handleRoundFinish = useCallback(async () => {
    if (!roundId || !round) return
    await roundPageStore.handleRoundFinish(roundId)
  }, [roundId, round])

  const timer = useTimer({
    startTime: round?.startTime || '',
    endTime: round?.endTime || '',
    updateInterval: TIMING.TIMER_UPDATE_INTERVAL,
    onFinish: handleRoundFinish,
  })

  useEffect(() => {
    if (!round || !isFinished || roundPageStore.hasLoadedFinalData) return

    const timeoutId = setTimeout(() => {
      handleRoundFinish()
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [round, isFinished, handleRoundFinish])

  const handleTap = useCallback(() => {
    if (!roundId || !round || !isActive) return
    roundPageStore.handleTap(roundId)
  }, [roundId, round, isActive])

  const canTap = isActive && !roundPageStore.loading

  if (roundPageStore.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Загрузка раунда..." />
      </div>
    )
  }

  if (roundPageStore.error && !roundPageStore.roundData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            error={roundPageStore.error}
            onRetry={() => roundId && roundPageStore.loadRound(roundId, false)}
          />
        </div>
      </div>
    )
  }

  if (!round) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-black text-xl">Раунд не найден</div>
      </div>
    )
  }

  const statusTitle = isFinished
    ? 'Раунд завершен'
    : isCooldown
      ? 'Cooldown'
      : 'Раунды'
  const displayTaps = roundPageStore.getDisplayTaps()

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border-2 border-black overflow-hidden">
          <div className="px-6 py-4 border-b-2 border-black">
            <PageHeader
              title={statusTitle}
              username={username}
              titleClassName="text-xl font-bold text-black"
              usernameClassName="text-black"
            />
          </div>

          <div className="p-6">
            {roundPageStore.error && (
              <div className="mb-4">
                <ErrorMessage error={roundPageStore.error} />
              </div>
            )}

            <div className="flex justify-center mb-8">
              <GooseGraphic canTap={canTap} onClick={handleTap} />
            </div>

            <RoundStatusDisplay
              status={status}
              round={round}
              roundData={roundPageStore.roundData}
              timer={timer}
              displayTaps={displayTaps}
            />

            <RoundNavigation onBack={() => navigate('/rounds')} />
          </div>
        </div>
      </div>
    </div>
  )
})

export default RoundPage;


