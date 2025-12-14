import { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { roundService } from '../services/RoundService'
import { type Round } from '../api/rounds'
import { roundsPageStore } from '../store/roundsPageStore'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { PageHeader } from '../components/PageHeader'
import { RoundCard } from '../components/round/RoundCard'
import { CreateRoundButton } from '../components/round/CreateRoundButton'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../hooks/useAuth'

const RoundsPage = observer(() => {
  const navigate = useNavigate()

  const fetchRounds = useCallback(() => roundService.getRounds(), [])

  const { data, loading, error, refetch } = useFetch<{ data: Round[]; pagination: { limit: number; nextCursor: string | null; hasMore: boolean } }>({
    fetchFn: fetchRounds,
    enabled: true,
  })

  const rounds = data?.data || []
  const { username, isAdmin } = useAuth()

  const handleCreateRound = async () => {
    const newRound = await roundsPageStore.createRound()
    if (newRound) {
      navigate(`/round/${newRound.id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Загрузка раундов..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-2 border-black p-6">
          <PageHeader title="Список РАУНДОВ" username={username}>
            {isAdmin && <CreateRoundButton onCreateRound={handleCreateRound} />}
          </PageHeader>

          {error && (
            <div className="mb-4">
              <ErrorMessage error={error} onRetry={refetch} />
            </div>
          )}

          {roundsPageStore.createError && (
            <div className="mb-4">
              <ErrorMessage error={roundsPageStore.createError} />
            </div>
          )}

          <div className="space-y-4">
            {rounds.map((round) => (
              <RoundCard key={round.id} round={round} />
            ))}
          </div>

          {rounds.length === 0 && !error && (
            <div className="text-center text-black py-8">
              Нет доступных раундов
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default RoundsPage;

