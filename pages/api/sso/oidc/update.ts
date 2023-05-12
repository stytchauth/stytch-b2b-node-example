// This API route updates the specified OIDC connection.
import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch, { Member } from "../../../../lib/loadStytch";
import { adminOnlyAPIRoute } from "../../../../lib/sessionService";

async function handler(
  member: Member,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      connection_id,
      display_name,
      client_id,
      client_secret,
      issuer,
      authorization_url,
      token_url,
      userinfo_url,
      jwks_url,
    } = JSON.parse(req.body);

    await loadStytch().sso.oidc.update({
      organization_id: member.organization_id,
      connection_id,
      display_name: display_name,
      client_id: client_id,
      client_secret: client_secret,
      issuer: issuer,
      authorization_url: authorization_url,
      token_url: token_url,
      userinfo_url: userinfo_url,
      jwks_url: jwks_url,
    });
    return res.status(200).end();
  } catch (e) {
    console.error("Failed to update OIDC connection", e);
    return res.status(400).end();
  }
}

export default adminOnlyAPIRoute(handler);
