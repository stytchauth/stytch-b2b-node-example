import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "@/lib/loadStytch";
import {
  clearIntermediateSession,
  getDiscoverySessionData,
  setSession,
} from "@/lib/sessionService";

const stytchClient = loadStytch();

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const discoverySessionData = getDiscoverySessionData(req, res);
  if (discoverySessionData.error) {
    console.log("No session tokens found...");
    return { redirect: { statusCode: 307, destination: `/` } };
  }

  const { orgID, memberID, code } = req.body;

  const authSMSMFAOTP = () => {
    return stytchClient.otps.sms.authenticate({
      organization_id: orgID,
      member_id: memberID,
      code: code,
      intermediate_session_token: discoverySessionData.intermediateSession,
    });
  };

  try {
    const { session_jwt, organization } = await authSMSMFAOTP();
    setSession(req, res, session_jwt);
    clearIntermediateSession(req, res);
    return res.redirect(307, `/${organization.organization_slug}/dashboard`);
  } catch (error) {
    console.error("Could not authenticate in callback", error);

    return res.redirect(307, "/discovery");
  }
}

export default handler;
