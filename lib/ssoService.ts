import loadStytch from "./loadStytch";

const stytch = loadStytch();

export const list = async (organization_id: string) => {
  return stytch.sso.getConnections({ organization_id });
};
export const createSaml = async (
  display_name: string,
  organization_id: string
) => {
  return stytch.sso.saml.createConnection({
    organization_id,
    display_name,
  });
};
export const createOidc = async (
  display_name: string,
  organization_id: string
) => {
  return stytch.sso.oidc.createConnection({
    organization_id,
    display_name,
  });
};
