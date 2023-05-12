// This API route sends a magic link to the specified email address.
import type { NextApiRequest, NextApiResponse } from "next";
import { getDomainFromRequest } from "../../lib/urlUtils";
import loadStytch, { Member } from "../../lib/loadStytch";
import { MemberService } from "../../lib/memberService";
import { adminOnlyAPIRoute } from "../../lib/sessionService";

async function handler(
  member: Member,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email } = JSON.parse(req.body);
    // Infer the organization_id from the member's org - don't let members invite
    // themselves to other organizations
    await MemberService.invite(email, member.organization_id);
    console.log("Successfully sent invite to", email);
    return res.status(200).end();
  } catch (e) {
    console.error("Failed to send invite", e);
    return res.status(400).end();
  }
}

export default adminOnlyAPIRoute(handler);
