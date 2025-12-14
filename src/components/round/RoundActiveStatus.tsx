type RoundActiveStatusProps = {
  timeLeft: string
  displayTaps: number
}

export const RoundActiveStatus = ({ timeLeft, displayTaps }: RoundActiveStatusProps) => {
  return (
    <>
      <div className="text-base mb-2 text-black">Раунд активен!</div>
      <div className="text-black mb-2">
        До конца осталось: <span className="font-bold">{timeLeft}</span>
      </div>
      <div className="text-base text-black">
        Мои очки - {displayTaps}
      </div>
    </>
  )
}
