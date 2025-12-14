type RoundCooldownStatusProps = {
  timeLeft: string
}

export const RoundCooldownStatus = ({ timeLeft }: RoundCooldownStatusProps) => {
  return (
    <>
      <div className="text-base mb-2 text-black">Cooldown</div>
      <div className="text-black">
        до начала раунда <span className="font-bold">{timeLeft}</span>
      </div>
    </>
  )
}
