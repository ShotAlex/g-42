import { lazy } from 'react'
import { type RouteObject, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'

const LoginPage = lazy(() => 
  import('../pages/LoginPage').then((module) => ({ 
    default: module.default 
  }))
)

const RoundsPage = lazy(() => 
  import('../pages/RoundsPage').then((module) => ({ 
    default: module.default 
  }))
)

const RoundPage = lazy(() => 
  import('../pages/RoundPage').then((module) => ({ 
    default: module.default 
  }))
)

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/rounds',
    element: (
      <ProtectedRoute>
        <RoundsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/round/:roundId',
    element: (
      <ProtectedRoute>
        <RoundPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: <Navigate to="/rounds" replace />,
  },
]
