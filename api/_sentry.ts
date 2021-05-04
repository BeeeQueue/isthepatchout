import { Boom, internal, isBoom } from "@hapi/boom"
import {
  captureException,
  flush,
  getCurrentHub,
  init,
  Integrations,
  setContext,
  setTag,
  startTransaction,
} from "@sentry/node"
import type { VercelRequest, VercelResponse } from "@vercel/node"

import "@sentry/tracing"

type Handler = (request: VercelRequest, response: VercelResponse) => Promise<void> | void
type CustomResponse = Record<string, unknown> & { message?: string; statusCode?: number }
type CustomHandlerResponse = undefined | CustomResponse | Boom<null>
export type CustomHandler = (
  request: VercelRequest,
) => Promise<CustomHandlerResponse> | CustomHandlerResponse

init({
  debug: true,
  enabled: process.env.VERCEL_ENV !== "development" && !!process.env.SENTRY_DSN,
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV as string,
  integrations: [new Integrations.Http({ tracing: true })],
  tracesSampleRate: 1.0,
})

setTag("app", "api")

export const sentryWrapper = (path: string, handler: CustomHandler): Handler => async (
  req,
  res,
) => {
  let response: NonNullable<CustomHandlerResponse>

  const trx = startTransaction({
    name: path,
    op: "transaction",
  })

  try {
    response = (await handler(req)) ?? {}
  } catch (error) {
    response = internal(error.message)

    setContext("response", {
      status: res.statusCode,
    })

    captureException(error)
  }

  trx.finish()

  await flush(1000)

  if (!isBoom(response)) {
    response.statusCode ??= 200

    res.status(response.statusCode).json({
      ...response,
      ok: true,
    })
  } else {
    const { payload, statusCode, headers } = response.output

    for (const [key, value] of Object.entries(headers)) {
      res.setHeader(key, value!)
    }

    res.status(statusCode).json({ ...payload, ok: false })
  }
}

export const startTask = (name: string) => {
  const transaction = getCurrentHub().getScope()?.getTransaction()

  if (transaction == null) throw new Error("thefuck")

  return transaction.startChild({
    op: "task",
    description: name,
  })
}