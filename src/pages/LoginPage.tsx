import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { loginFormStore } from '../store/loginFormStore'
import { ErrorMessage } from '../components/ErrorMessage'

const LoginPage = observer(() => {
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await loginFormStore.submit()
    if (success) {
      navigate('/rounds')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black p-8 w-full max-w-md">
        <h1 className="text-xl font-bold text-center mb-8 text-black">
          ВОЙТИ
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm mb-2 text-black">
              Имя пользователя:
            </label>
            <input
              id="username"
              type="text"
              value={loginFormStore.username}
              onChange={(e) => loginFormStore.setUsername(e.target.value)}
              className={`w-full px-4 py-2 border-2 border-black focus:outline-none ${
                loginFormStore.usernameError ? 'border-black' : 'border-black'
              }`}
              aria-invalid={!!loginFormStore.usernameError}
              aria-describedby={loginFormStore.usernameError ? 'username-error' : undefined}
            />
            {loginFormStore.usernameError && (
              <p id="username-error" className="mt-1 text-sm text-black" role="alert">
                {loginFormStore.usernameError}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-2 text-black">
              Пароль:
            </label>
            <input
              id="password"
              type="password"
              value={loginFormStore.password}
              onChange={(e) => loginFormStore.setPassword(e.target.value)}
              className={`w-full px-4 py-2 border-2 border-black focus:outline-none ${
                loginFormStore.passwordError ? 'border-black' : 'border-black'
              }`}
              aria-invalid={!!loginFormStore.passwordError}
              aria-describedby={loginFormStore.passwordError ? 'password-error' : undefined}
            />
            {loginFormStore.passwordError && (
              <p id="password-error" className="mt-1 text-sm text-black" role="alert">
                {loginFormStore.passwordError}
              </p>
            )}
          </div>
          {loginFormStore.error && (
            <div className="mt-2">
              <ErrorMessage error={loginFormStore.error} />
            </div>
          )}
          <button
            type="submit"
            disabled={loginFormStore.loading}
            className="w-full bg-black text-white py-3 border-2 border-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginFormStore.loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
})

export default LoginPage;
