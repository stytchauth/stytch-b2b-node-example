import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "@/lib/loadStytch";
import {
  clearIntermediateSession, clearSession,
  getDiscoverySessionData, setIntermediateSession,
  setSession,
} from "@/lib/sessionService";

const stytchClient = loadStytch();

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const discoverySessionData = getDiscoverySessionData(req, res);
  if (discoverySessionData.error) {
    console.log("No session tokens found...");
    return { redirect: { statusCode: 307, destination: `/login` } };
  }

  const orgId = req.query.orgId;
  if (!orgId || Array.isArray(orgId)) {
    return res.redirect(307, "/discovery");
  }

  const exchangeSession = () => {
    if (discoverySessionData.isDiscovery) {
      return stytchClient.discovery.intermediateSessions.exchange({
        intermediate_session_token: discoverySessionData.intermediateSession,
        organization_id: orgId,
        session_duration_minutes: 60,
      });
    }
    return stytchClient.sessions.exchange({
      organization_id: orgId,
      session_jwt: discoverySessionData.sessionJWT,
    });
  };

  try {
    const { session_jwt, organization, intermediate_session_token, mfa_required } = await exchangeSession();
    if(session_jwt === "") {
      setIntermediateSession(req, res, intermediate_session_token)
      clearSession(req, res)
      if(mfa_required != null && mfa_required.secondary_auth_initiated == "sms_otp") {
        return res.redirect(307, `/smsmfa?sent=true`);
      } else {
        return res.redirect(307, `/smsmfa?sent=false`);
      }
    }
    setSession(req, res, session_jwt);
    clearIntermediateSession(req, res);
    return res.redirect(307, `/${organization.organization_slug}/dashboard`);
  } catch (error) {
    console.error("Could not authenticate in callback", error);

    return res.redirect(307, "/discovery");
  }
}

export default handler;
