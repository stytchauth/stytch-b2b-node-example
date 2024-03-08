// This API route sends a magic link to the specified email address.
import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "@/lib/loadStytch";
import Cookies from "cookies";
import {
  SESSION_DURATION_MINUTES,
  clearIntermediateSession,
  clearSession,
  setIntermediateSession,
  setSession,
} from "@/lib/sessionService";
import { StytchError } from "stytch";

const stytchClient = loadStytch();

type ErrorData = {
  errorString: string;
};

function toDomain(email: string): string {
  return email.split("@")[1];
}

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorData>
) {
  const cookies = new Cookies(req, res);
  const intermediateSession = cookies.get("intermediate_session");
  if (!intermediateSession) {
    return res.redirect(307, "/discovery");
  }
  const { organization_name, require_mfa } = req.body;

  try {
    const { member, organization, session_jwt, intermediate_session_token } =
      await stytchClient.discovery.organizations.create({
        intermediate_session_token: intermediateSession,
        email_allowed_domains: [],
        organization_name: organization_name,
        session_duration_minutes: SESSION_DURATION_MINUTES,
        mfa_policy: require_mfa ? "REQUIRED_FOR_ALL" : "OPTIONAL",
        organization_slug: organization_name.toLowerCase().replace(/\s/g, ""),
      });

    // Make the organization discoverable to other emails
    if (organization) {
      try {
        await stytchClient.organizations.update({
          organization_id: organization.organization_id,
          email_jit_provisioning: "RESTRICTED",
          sso_jit_provisioning: "ALL_ALLOWED",
          email_allowed_domains: [toDomain(member.email_address)],
        });
      } catch (e) {
        if (
          e instanceof StytchError &&
          e.error_type == "organization_settings_domain_too_common"
        ) {
          console.log(
            "User domain is common email provider, cannot link to organization"
          );
        } else {
          throw e;
        }
      }

      // Mark the first user in the organization as the admin
      await stytchClient.organizations.members.update({
        organization_id: organization.organization_id,
        member_id: member.member_id,
        trusted_metadata: { admin: true },
      });

      if (session_jwt === "") {
        setIntermediateSession(req, res, intermediate_session_token);
        clearSession(req, res);
        return res.redirect(
          302,
          `/${organization.organization_slug}/smsmfa?sent=false&org_id=${organization.organization_id}&member_id=${member.member_id}`
        );
      }
      clearIntermediateSession(req, res);
      setSession(req, res, session_jwt);
      return res.redirect(307, `/${organization.organization_slug}/dashboard`);
    }
  } catch (error) {
    const errorString = JSON.stringify(error);
    console.log(error);
    return res.redirect(307, "/discovery");
  }
}

export default handler;
