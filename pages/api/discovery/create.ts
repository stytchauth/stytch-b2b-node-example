// This API route sends a magic link to the specified email address.
import type {NextApiRequest, NextApiResponse} from 'next';
import loadStytch from '../../../lib/loadStytch';
import Cookies from "cookies";
import {clearIntermediateSession, setSession} from "../../../lib/sessionService";

const stytchClient = loadStytch();

type ErrorData = {
  errorString: string;
};

function toSlug(orgName: string): string {
  return orgName
    .toLowerCase()
    .replaceAll(/[^\s\w]/g, '')
    .replaceAll(/\s/g, '-');
}

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData>) {
  const cookies = new Cookies(req, res)
  const intermediateSession = cookies.get('intermediate_session');
  if (!intermediateSession) {
    return res.redirect(307, '/discovery');
  }
  const {organization_name} = req.body;
  const organization_slug = toSlug(organization_name);

  try {
    const {member, organization, session_jwt} = await stytchClient.discovery.organization({
      intermediate_session_token: intermediateSession,
      organization_name,
      organization_slug,
      session_duration_minutes: 60
    });

    // Mark the first user in the organization as the admin
    await stytchClient.organizations.members.update({
      organization_id: organization.organization_id,
      member_id: member.member_id,
      trusted_metadata: {admin: true}
    })

    clearIntermediateSession(req, res);
    setSession(req, res, session_jwt);
    return res.redirect(307, `/${organization_slug}/dashboard`);
  } catch (error) {
    const errorString = JSON.stringify(error);
    console.log(error);
    return res.redirect(307, '/discovery');
  }
}

export default handler;
