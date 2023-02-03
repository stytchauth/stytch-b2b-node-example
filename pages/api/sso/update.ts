// This API route sends a magic link to the specified email address.
import type {NextApiRequest, NextApiResponse} from 'next';
import Cookies from "cookies";
import {MemberService} from "../../../lib/memberService";
import {SSOService} from "../../../lib/ssoService";
import loadStytch from "../../../lib/loadStytch";


export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);
  const sessionToken = cookies.get("session")
  const slug = cookies.get("slug")

  // TODO: Can we make this a nice util?
  if (!sessionToken) {
    console.log('No session token found...')
    return res.status(401).end();
  }

  const member = await MemberService.findBySessionToken(sessionToken);
  if (!member) {
    return res.status(401).end();
  }


  try {
    const {
      display_name,
      idp_sso_url,
      idp_entity_id,
      email_attribute,
      first_name_attribute,
      last_name_attribute,
      certificate,
      connection_id
    } = JSON.parse(req.body);

    await loadStytch().sso.saml.update(member.organization_id, connection_id, {
      entity_id: idp_entity_id,
      display_name: display_name,
      attribute_mapping: {
        email: email_attribute,
        first_name: first_name_attribute,
        last_name: last_name_attribute,
      },
      x509_certificate: certificate,
      idp_sso_url: idp_sso_url,
    })
    return res.status(200).end();
  } catch (e) {
    console.error('Failed to update SSO connection', e)
    return res.status(400).end();
  }
}

export default handler;
