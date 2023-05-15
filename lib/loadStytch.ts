import * as stytch from "stytch";

let client: stytch.B2BClient;

export const publicToken = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;

export type Member = Awaited<
  ReturnType<typeof client.magicLinks.authenticate>
>["member"];
export type Organization = Awaited<
  ReturnType<typeof client.organizations.get>
>["organization"];
export type SessionsAuthenticateResponse = Awaited<
  ReturnType<typeof client.sessions.authenticate>
>;
export type SAMLConnection = Awaited<
  ReturnType<typeof client.sso.saml.create>
>["connection"];

export type OIDCConnection = Awaited<
  ReturnType<typeof client.sso.oidc.create>
>["connection"];

export type DiscoveredOrganizations = Awaited<
  ReturnType<typeof client.discovery.organizations.list>
>["discovered_organizations"];

const stytchEnv =
  process.env.NEXT_PUBLIC_STYTCH_PROJECT_ENV === "live"
    ? stytch.envs.live
    : stytch.envs.test;

export const formatSSOStartURL = (connection_id: string): string => {
  return `${stytchEnv}public/sso/start?connection_id=${connection_id}&public_token=${publicToken}`;
};

const loadStytch = () => {
  if (!client) {
    client = new stytch.B2BClient({
      project_id: process.env.STYTCH_PROJECT_ID || "",
      secret: process.env.STYTCH_SECRET || "",
      env: stytchEnv,
    });
  }

  return client;
};

export default loadStytch;
