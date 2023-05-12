import loadStytch from "./loadStytch";

const stytch = loadStytch();

export const SSOService = {
  list: async function (organization_id: string) {
    return stytch.sso.get({ organization_id });
  },
  createSaml: async function (display_name: string, organization_id: string) {
    return stytch.sso.saml.create({
      organization_id,
      display_name,
    });
  },
  createOidc: async function (display_name: string, organization_id: string) {
    return stytch.sso.oidc.create({
      organization_id,
      display_name,
    });
  },
  // delete: async function(member_id: string, organization_id: string) {
  //   return stytch.organizations.members.delete({
  //     organization_id,
  //     member_id,
  //   })
  // },
  // findBySessionToken: async function (sessionToken: string): Promise<Member | null> {
  //   return stytch.sessions.authenticate({
  //     session_duration_minutes: 30, // extend the session a bit
  //     session_token: sessionToken
  //   })
  //     .then(res => {
  //       return res.member
  //     })
  //     .catch(err => {
  //       console.error('Could not find member by session token', err)
  //       return null
  //     })
  // }
};
