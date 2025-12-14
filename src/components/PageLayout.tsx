import { type ReactNode } from 'react'

type PageLayoutProps = {
  children: ReactNode
  title?: string
  header?: ReactNode
  className?: string
}

export const PageLayout = ({ children, title, header, className = '' }: PageLayoutProps) => {
  return (
    <div className={`min-h-screen p-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          {(title || header) && (
            <div className="flex justify-between items-center mb-6">
              {title && <h1 className="text-2xl font-bold text-gray-800">{title}</h1>}
              {header}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
