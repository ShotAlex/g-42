import { memo } from 'react'

type GooseGraphicProps = {
  canTap?: boolean
  onClick?: () => void
}

const GOOSE_GRAPHIC = `      
      ░░░░░░░░░░░░░░░      
    ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░     
  ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░   
  ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░   
░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░ 
░░▒▒▒▒░░░░▓▓▓▓▓▓▓▓░░░░▒▒▒▒░░
░░▒▒▒▒▒▒▒▒░░░░░░░░▒▒▒▒▒▒▒▒░░
░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░ 
  ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░   
    ░░░░░░░░░░░░░░░░░░░░   
`;

export const GooseGraphic = memo<GooseGraphicProps>(
  ({ canTap = false, onClick }) => {
    return (
      <div
        onClick={canTap ? onClick : undefined}
        className={`relative inline-block select-none ${canTap
            ? 'cursor-pointer hover:scale-105 active:scale-95'
            : 'cursor-default opacity-75'
          }`}
      >
        <div className="bg-white p-6 border-2 border-black">
          <pre className="text-3xl font-mono leading-tight text-center">{GOOSE_GRAPHIC}</pre>
        </div>
      </div>
    )
  }
)

GooseGraphic.displayName = 'GooseGraphic'
