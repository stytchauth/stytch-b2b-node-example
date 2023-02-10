// This API route sends a magic link to the specified email address.
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDomainFromRequest } from '../../lib/urlUtils';
import loadStytch from '../../lib/loadStytch';

type ErrorData = {
  errorString: string;
};

function toSlug(orgName: string): string {
  return orgName
    .toLowerCase()
    .replaceAll(/[^\s\w]/g, '')
    .replaceAll(/\s/g, '-');
}

function toDomain(email: string): string {
  return email.split('@')[1];
}

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData>) {
  const stytchClient = loadStytch();
  const { email, organization_name } = JSON.parse(req.body);
  try {
    const orgCreateRes = await stytchClient.organizations.create({
      organization_name: organization_name,
      organization_slug: toSlug(organization_name),
      email_allowed_domains: [toDomain(email)],
      sso_jit_provisioning: 'ALL_ALLOWED',
      email_jit_provisioning: 'RESTRICTED',
      email_invites: 'ALL_ALLOWED',
    });

    const domain = getDomainFromRequest(req);

    await stytchClient.magicLinks.email.loginOrSignup({
      email_address: email,
      organization_id: orgCreateRes.organization.organization_id,
      login_redirect_url: `${domain}/api/callback`,
      signup_redirect_url: `${domain}/api/callback`,
    });
    return res.status(200).end();
  } catch (error) {
    const errorString = JSON.stringify(error);
    console.log(error);
    return res.status(400).json({ errorString });
  }
}

export default handler;
