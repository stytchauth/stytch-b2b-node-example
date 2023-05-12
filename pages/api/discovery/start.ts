// This API route sends a magic link to the specified email address.
import type { NextApiRequest, NextApiResponse } from "next";
import { getDomainFromRequest } from "../../../lib/urlUtils";
import loadStytch from "../../../lib/loadStytch";
import { MemberService } from "../../../lib/memberService";

type ErrorData = {
  errorString: string;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorData>
) {
  const stytchClient = loadStytch();
  const { email } = JSON.parse(req.body);
  const domain = getDomainFromRequest(req);

  try {
    await stytchClient.magicLinks.email.discovery.send({
      email_address: email,
      discovery_redirect_url: `${domain}/api/callback`,
    });
    return res.status(200).end();
  } catch (error) {
    const errorString = JSON.stringify(error);
    console.log(error);
    return res.status(400).json({ errorString });
  }
}

export default handler;
