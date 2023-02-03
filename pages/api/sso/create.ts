// This API route sends a magic link to the specified email address.
import type {NextApiRequest, NextApiResponse} from 'next';
import Cookies from "cookies";
import {MemberService} from "../../../lib/memberService";
import {SSOService} from "../../../lib/ssoService";


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
    const {display_name} = JSON.parse(req.body);
    const {connection} = await SSOService.create(display_name, member.organization_id);
    console.log('Successfully created new SSO connection', connection.connection_id)
    return res.status(200).json(connection);
  } catch (e) {
    console.error('Failed to create SSO connection', e)
    return res.status(400).end();
  }
}

export default handler;
