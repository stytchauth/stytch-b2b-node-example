// This API route sends a magic link to the specified email address.
import type { NextApiRequest, NextApiResponse } from "next";
import { getDomainFromRequest } from "../../lib/urlUtils";
import loadStytch from "../../lib/loadStytch";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const stytchClient = loadStytch();
  const { email, organization_id } = JSON.parse(req.body);
  const domain = getDomainFromRequest(req);
  try {
    await stytchClient.magicLinks.email.loginOrSignup({
      email_address: email,
      organization_id: organization_id,
      login_redirect_url: `${domain}/api/callback`,
      signup_redirect_url: `${domain}/api/callback`,
    });
    return res.status(200).end();
  } catch (error) {
    console.log("error sending magic link", error);
    const errorString = JSON.stringify(error);
    return res.status(400).json({ errorString });
  }
}

export default handler;
