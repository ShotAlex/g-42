export type ApiError = {
    message: string
    detail?: string
    status?: number
    code?: string
  }
  
  export type ApiErrorResponse = {
    message: string
    detail?: string
  } & Record<string, unknown>
  
  export class ApiException extends Error {
    status: number
    code?: string
    detail?: string
    response?: ApiErrorResponse
  
    constructor(message: string, status: number, response?: ApiErrorResponse) {
      super(message)
      this.name = 'ApiException'
      this.status = status
      this.response = response
      this.detail = response?.detail
      this.code = response?.code as string | undefined
    }
  }
  