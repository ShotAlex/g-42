import { makeAutoObservable, runInAction } from 'mobx'
import { authStore } from './authStore'
import { ApiException } from '../types/api'
import { validateLoginForm } from '../utils/loginValidation'
import { toApiException } from '../utils/error'

class LoginFormStore {
  username = ''
  password = ''
  usernameError = ''
  passwordError = ''
  error: ApiException | null = null
  loading = false

  constructor() {
    makeAutoObservable(this)
  }

  setUsername(value: string): void {
    this.username = value
    if (this.usernameError) {
      this.usernameError = ''
    }
  }

  setPassword(value: string): void {
    this.password = value
    if (this.passwordError) {
      this.passwordError = ''
    }
  }

  validateForm(): boolean {
    const validation = validateLoginForm({
      username: this.username,
      password: this.password,
    })

    this.usernameError = validation.usernameError
    this.passwordError = validation.passwordError

    return validation.isValid
  }

  clearErrors(): void {
    this.error = null
    this.usernameError = ''
    this.passwordError = ''
  }

  async submit(): Promise<boolean> {
    this.clearErrors()

    if (!this.validateForm()) {
      return false
    }

    this.loading = true

    try {
      await authStore.login(this.username, this.password)
      runInAction(() => {
        this.loading = false
      })
      return true
    } catch (err) {
      runInAction(() => {
        this.error = toApiException(
          err,
          'Ошибка входа. Проверьте имя пользователя и пароль.',
          500
        )
        this.loading = false
      })
      return false
    }
  }

  reset(): void {
    this.username = ''
    this.password = ''
    this.clearErrors()
    this.loading = false
  }
}

export const loginFormStore = new LoginFormStore()
