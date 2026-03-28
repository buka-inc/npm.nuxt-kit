import { createExceptionByStatusCode } from '@keq-request/exception'
import type { KeqMiddleware } from 'keq'
import { BukaRequestException } from './buka-request-exception.js'

interface ExceptionResponse {
  error: {
    code: string
    message: string
    details: Array<{ type: string; [key: string]: unknown }>
  }
}

export const bukaErrorMiddleware: KeqMiddleware = async (ctx, next) => {
  await next()

  if (!ctx.response) return
  if (ctx.response.status >= 200 && ctx.response.status < 400) return

  const response = ctx.response

  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw createExceptionByStatusCode(response)
  }

  const body = await response.json()

  if (body !== null && typeof body === 'object' && 'error' in body) {
    const { error } = body as ExceptionResponse
    throw new BukaRequestException(response.status, error.message, {
      code: error.code,
      details: error.details,
      response,
      fatal: [401, 403, 404].includes(response.status),
    })
  }

  throw createExceptionByStatusCode(response)
}
