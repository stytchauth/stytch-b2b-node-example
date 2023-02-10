// This API route sends a magic link to the specified email address.
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDomainFromRequest } from '../../lib/urlUtils';
import loadStytch from '../../lib/loadStytch';
import Cookies from 'cookies';
import { OrgService } from '../../lib/orgService';
import { MemberService } from '../../lib/memberService';
import { Member } from '../../lib/StytchB2BClient/base';
import { withSession } from '../../lib/sessionService';

async function handler(member: Member, req: NextApiRequest, res: NextApiResponse) {
  try {
    const { member_id } = JSON.parse(req.body);
    // Infer the organization_id from the member's org - don't let members invite
    // themselves to other organizations
    await MemberService.delete(member_id, member.organization_id);
    console.log('Successfully deleted', member_id);
    return res.status(200).end();
  } catch (e) {
    console.error('Failed to send invite', e);
    return res.status(400).end();
  }
}

export default withSession(handler);
