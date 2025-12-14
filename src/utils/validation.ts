export type ValidationRule<T> = {
  validator: (value: T) => boolean
  message: string
}

export type ValidationResult = {
  isValid: boolean
  errors: string[]
}

export const validators = {
  required: <T>(value: T | null | undefined): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0
    }
    return value !== null && value !== undefined
  },

  minLength: (min: number) => (value: string): boolean => {
    return value.length >= min
  },

  maxLength: (max: number) => (value: string): boolean => {
    return value.length <= max
  },

  username: (value: string): boolean => {
    return /^[a-zA-Z0-9_]{3,32}$/.test(value)
  },

  password: (value: string): boolean => {
    return value.length >= 3 && value.length <= 64
  },

  uuid: (value: string): boolean => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(value)
  },
}

export function validate<T>(
  value: T,
  rules: ValidationRule<T>[]
): ValidationResult {
  const errors: string[] = []

  for (const rule of rules) {
    if (!rule.validator(value)) {
      errors.push(rule.message)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
