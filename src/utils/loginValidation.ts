import { validate, validators } from './validation'

type LoginFormData = {
  username: string
  password: string
}

type LoginValidationResult = {
  isValid: boolean
  usernameError: string
  passwordError: string
}

export function validateLoginForm(formData: LoginFormData): LoginValidationResult {
  const usernameValidation = validate(formData.username, [
    {
      validator: validators.required,
      message: 'Имя пользователя обязательно',
    },
    {
      validator: validators.username,
      message: 'Имя пользователя должно быть от 3 до 32 символов (буквы, цифры, _)',
    },
  ])

  const passwordValidation = validate(formData.password, [
    {
      validator: validators.required,
      message: 'Пароль обязателен',
    },
    {
      validator: validators.password,
      message: 'Пароль должен быть от 3 до 64 символов',
    },
  ])

  return {
    isValid: usernameValidation.isValid && passwordValidation.isValid,
    usernameError: usernameValidation.errors[0] || '',
    passwordError: passwordValidation.errors[0] || '',
  }
}
