type CreateRoundButtonProps = {
  onCreateRound: () => void
  disabled?: boolean
}

export const CreateRoundButton = ({ onCreateRound, disabled = false }: CreateRoundButtonProps) => {
  return (
    <button
      onClick={onCreateRound}
      disabled={disabled}
      className="bg-black text-white px-6 py-2 border-2 border-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Создать раунд
    </button>
  )
}
