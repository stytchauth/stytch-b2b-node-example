import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "@/lib/loadStytch";
import {
  SESSION_DURATION_MINUTES,
  clearIntermediateSession,
  clearSession,
  getDiscoverySessionData,
  setIntermediateSession,
  setSession,
} from "@/lib/sessionService";
import { MfaRequired } from "stytch/types/lib/b2b/mfa";
import { Member, Organization } from "stytch";

const stytchClient = loadStytch();

function redirectToSMSMFA(
  res: NextApiResponse,
  organization: Organization,
  member: Member,
  mfa_required: MfaRequired | undefined
) {
  if (
    mfa_required != null &&
    mfa_required.secondary_auth_initiated == "sms_otp"
  ) {
    // An OTP code is automatically sent if Stytch knows the member's phone number
    return res.redirect(
      302,
      `/${organization.organization_slug}/smsmfa?sent=true&org_id=${organization.organization_id}&member_id=${member.member_id}`
    );
  }
  return res.redirect(
    302,
    `/${organization.organization_slug}/smsmfa?sent=false&org_id=${organization.organization_id}&member_id=${member.member_id}`
  );
}

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const discoverySessionData = getDiscoverySessionData(req, res);
  if (discoverySessionData.error) {
    console.log("No session tokens found...");
    return { redirect: { statusCode: 307, destination: `/` } };
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
        session_duration_minutes: SESSION_DURATION_MINUTES,
      });
    }
    return stytchClient.sessions.exchange({
      organization_id: orgId,
      session_jwt: discoverySessionData.sessionJWT,
    });
  };

  try {
    const {
      session_jwt,
      organization,
      member,
      intermediate_session_token,
      mfa_required,
    } = await exchangeSession();
    if (session_jwt === "") {
      setIntermediateSession(req, res, intermediate_session_token);
      clearSession(req, res);
      return redirectToSMSMFA(res, organization, member, mfa_required);
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
