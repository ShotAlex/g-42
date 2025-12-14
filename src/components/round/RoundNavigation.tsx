import { ArrowLeftIcon } from '../Icons'

type RoundNavigationProps = {
  onBack: () => void
}

export const RoundNavigation = ({ onBack }: RoundNavigationProps) => {
  return (
    <div className="text-center pt-4 border-t-2 border-black">
      <button
        onClick={onBack}
        className="text-black font-bold inline-flex items-center gap-2 hover:underline"
      >
        <ArrowLeftIcon />
        <span>Вернуться к списку раундов</span>
      </button>
    </div>
  )
}
