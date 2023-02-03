// This API route sends a magic link to the specified email address.
import type {NextApiRequest, NextApiResponse} from 'next';
import {getDomainFromRequest} from '../../lib/urlUtils';
import loadStytch from '../../lib/loadStytch';
import Cookies from "cookies";
import {OrgService} from "../../lib/orgService";
import {MemberService} from "../../lib/memberService";


export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);
  const sessionToken = cookies.get("session")

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
    const {member_id} = JSON.parse(req.body);
    // Infer the organization_id from the member's org - don't let members invite
    // themselves to other organizations
    await MemberService.delete(member_id, member.organization_id)
    console.log('Successfully deleted', member_id)
    return res.status(200).end();
  } catch (e) {
    console.error('Failed to send invite', e)
    return res.status(400).end();
  }
}

export default handler;
