import { RoundFinishedStats } from './RoundFinishedStats'
import { RoundActiveStatus } from './RoundActiveStatus'
import { RoundCooldownStatus } from './RoundCooldownStatus'
import { type RoundDetailResponse } from '../../api/rounds'
import { type Round } from '../../api/rounds'
import { RoundStatus } from '../../types/rounds'

type RoundStatusDisplayProps = {
  status: RoundStatus | null
  round: Round
  roundData: RoundDetailResponse | null
  timer: {
    timeLeft: string
  }
  displayTaps: number
}

export const RoundStatusDisplay = ({
  status,
  round,
  roundData,
  timer,
  displayTaps,
}: RoundStatusDisplayProps) => {
  const isFinished = status === RoundStatus.FINISHED
  const isCooldown = status === RoundStatus.COOLDOWN

  return (
    <div className="text-center space-y-4 mb-8">
      {isFinished ? (
        <RoundFinishedStats round={round} roundData={roundData} />
      ) : isCooldown ? (
        <RoundCooldownStatus timeLeft={timer.timeLeft} />
      ) : (
        <RoundActiveStatus
          timeLeft={timer.timeLeft}
          displayTaps={displayTaps}
        />
      )}
    </div>
  )
}
