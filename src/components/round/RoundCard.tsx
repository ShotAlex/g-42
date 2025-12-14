import { Link } from 'react-router-dom'
import { type Round } from '../../api/rounds'
import { roundService } from '../../services/RoundService'
import { ROUND_STATUS_LABELS } from '../../types/rounds'
import { formatDateTime } from '../../utils/date'

type RoundCardProps = {
  round: Round
}

export const RoundCard = ({ round }: RoundCardProps) => {
  const status = roundService.getRoundStatus(round)

  return (
    <Link
      to={`/round/${round.id}`}
      className="block border-2 border-black p-4 hover:bg-gray-100"
    >
      <div className="flex items-start">
        <span className="mr-2 text-black">●</span>
        <div className="flex-1">
          <div className="font-bold text-black mb-2">Round ID: {round.id}</div>
          <div className="text-sm text-black space-y-1">
            <div>Start: {formatDateTime(round.startTime)}</div>
            <div>End: {formatDateTime(round.endTime)}</div>
          </div>
          <div className="mt-3 pt-3 border-t-2 border-black">
            <div className="text-sm font-bold text-black">
              Статус: {ROUND_STATUS_LABELS[status]}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
