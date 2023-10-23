import { getServerSession } from "next-auth"

import type { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "../auth/[...nextauth]/route"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  res.send(JSON.stringify(session, null, 2))
}
