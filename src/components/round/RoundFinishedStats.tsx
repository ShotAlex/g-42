import { type RoundDetailResponse } from '../../api/rounds'
import { type Round } from '../../api/rounds'

type RoundFinishedStatsProps = {
  round: Round
  roundData: RoundDetailResponse | null
}

export const RoundFinishedStats = ({ round, roundData }: RoundFinishedStatsProps) => {
  return (
    <>
      <div className="text-base mb-4 text-black">─────────────────</div>
      <div className="space-y-2 text-left max-w-xs mx-auto">
        <div className="flex justify-between">
          <span className="text-black">Всего</span>
          <span className="font-bold">{round.totalScore}</span>
        </div>
        {roundData?.topStats && roundData.topStats.length > 0 && (
          <div className="flex justify-between">
            <span className="text-black">
              Победитель - {roundData.topStats[0].user.username}
            </span>
            <span className="font-bold">{roundData.topStats[0].taps}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-black">Мои очки</span>
          <span className="font-bold">{roundData?.myStats.taps || 0}</span>
        </div>
      </div>
    </>
  )
}
