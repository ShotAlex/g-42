import { type ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  username?: string | null
  className?: string
  children?: ReactNode
  titleClassName?: string
  usernameClassName?: string
}

export const PageHeader = ({
  title,
  username,
  className = '',
  children,
  titleClassName = 'text-xl font-bold text-black',
  usernameClassName = 'text-black',
}: PageHeaderProps) => {
  return (
    <div className={`flex justify-between items-center mb-6 ${className}`}>
      <h1 className={titleClassName}>{title}</h1>
      <div className="flex items-center gap-4">
        {username && <div className={usernameClassName}>{username}</div>}
        {children}
      </div>
    </div>
  )
}
