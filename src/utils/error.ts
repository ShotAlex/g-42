import { ApiException } from '../types/api'

export function toApiException(
  error: unknown,
  defaultMessage = 'Произошла ошибка',
  defaultStatus = 500
): ApiException {
  if (error instanceof ApiException) {
    return error
  }

  if (error instanceof Error) {
    return new ApiException(error.message || defaultMessage, defaultStatus)
  }

  return new ApiException(defaultMessage, defaultStatus)
}
