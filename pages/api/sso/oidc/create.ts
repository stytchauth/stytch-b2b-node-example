// This API route creates an OIDC connection
import type { NextApiRequest, NextApiResponse } from "next";
import { adminOnlyAPIRoute } from "@/lib/sessionService";
import { Member } from "@/lib/loadStytch";
import { createOidc } from "@/lib/ssoService";

async function handler(
  member: Member,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { display_name } = JSON.parse(req.body);
    const { connection } = await createOidc(
      display_name,
      member.organization_id
    );
    console.log(
      "Successfully created new OIDC connection",
      connection.connection_id
    );
    return res.status(200).json(connection);
  } catch (e) {
    console.error("Failed to create OIDC connection", e);
    return res.status(400).end();
  }
}

export default adminOnlyAPIRoute(handler);
