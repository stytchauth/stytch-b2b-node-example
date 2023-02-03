import {Member} from "./StytchB2BClient/base";
import loadStytch from "./loadStytch";

const stytch = loadStytch();

export const MemberService = {
  invite: async function(email: string, organization_id: string) {
    return stytch.magicLinks.email.invite({email_address: email, organization_id: organization_id})
  },
  delete: async function(member_id: string, organization_id: string) {
    return stytch.organizations.members.delete({
      organization_id,
      member_id,
    })
  },
  findBySessionToken: async function (sessionToken: string): Promise<Member | null> {
    return stytch.sessions.authenticate({
      session_duration_minutes: 30, // extend the session a bit
      session_token: sessionToken
    })
      .then(res => {
        return res.member
      })
      .catch(err => {
        console.error('Could not find member by session token', err)
        return null
      })
  }
}