import type { ExceptionDetail } from '@buka/exception'
import { ErrorCode } from '@buka/error-codes'
import { RequestException, type RequestExceptionOptions } from 'keq'

export interface BukaRequestExceptionOptions extends RequestExceptionOptions {
  code: string
  details?: ExceptionDetail[]
}

export class BukaRequestException extends RequestException {
  code: string
  errorCode: ErrorCode
  details: ExceptionDetail[]

  constructor(statusCode: number, message: string, options: BukaRequestExceptionOptions) {
    super(statusCode, message, options)
    this.details = options.details ?? []
    this.code = options.code
    this.errorCode = ErrorCode.fromString(options.code)
  }
}
