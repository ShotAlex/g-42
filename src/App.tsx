import { Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import { useAuthRestore } from './hooks/useAuthRestore'
import { OnlineStatus } from './components/OnlineStatus'
import { SuspenseFallback } from './components/SuspenseFallback'
import { routes } from './constants/routes'

const AppRoutes = observer(() => {
  useAuthRestore()

  const element = useRoutes(routes)

  return (
    <>
      <OnlineStatus />
      <Suspense fallback={<SuspenseFallback />}>
        {element}
      </Suspense>
    </>
  )
})

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
