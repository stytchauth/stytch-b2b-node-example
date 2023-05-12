// This API route sends a magic link to the specified email address.
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
      display_name,
      idp_sso_url,
      idp_entity_id,
      email_attribute,
      first_name_attribute,
      last_name_attribute,
      certificate,
      connection_id,
    } = JSON.parse(req.body);
    await loadStytch().sso.saml.update({
      organization_id: member.organization_id,
      connection_id,
      idp_entity_id: idp_entity_id,
      display_name: display_name,
      attribute_mapping: {
        email: email_attribute,
        first_name: first_name_attribute,
        last_name: last_name_attribute,
      },
      x509_certificate: certificate,
      idp_sso_url: idp_sso_url,
    });
    return res.status(200).end();
  } catch (e) {
    console.error("Failed to update SAML connection", e);
    return res.status(400).end();
  }
}

export default adminOnlyAPIRoute(handler);
