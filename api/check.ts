import type { VercelRequest, VercelResponse } from "@vercel/node"

import { getPatchList } from "./_dota"
import { sentryWrapper } from "./_sentry"
import {
  formatPatchData,
  insertUpcomingPatches,
  removeUnreleasedPatches,
  upsertPatches,
} from "./_supabase"

const { CHECK_TOKEN } = process.env

const checkAndUpdatePatches = async () => {
  const releasedPatches = await getPatchList()

  if (releasedPatches == null) {
    throw new Error("Could not get patches")
  }

  const formattedPatches = releasedPatches.map(formatPatchData)
  await upsertPatches(formattedPatches)

  await removeUnreleasedPatches()
  await insertUpcomingPatches()
}

/**
 * GET /api/check
 * When an authenticated request comes through we get the two possible
 * upcoming patches (letter and minor) and check if they are out.
 *
 * If a new patch is released, we update it with `released: true`, new links,
 * and add new patches to check in the future.
 */
const handler = async (request: VercelRequest, response: VercelResponse) => {
  if (CHECK_TOKEN == null || request.headers.authorization !== `Bearer ${CHECK_TOKEN}`) {
    response.status(403).json({ ok: false, message: "Forbidden" })

    return
  }

  throw new Error("Test error #2")

  try {
    await checkAndUpdatePatches()
  } catch (err) {
    response.status(500).json({ ok: false, message: err.message })

    return
  }

  response.status(200).json({ ok: true })
}

export default sentryWrapper("/check", handler)
