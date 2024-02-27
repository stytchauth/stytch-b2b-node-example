import loadStytch from "./loadStytch";
import {StytchError} from "stytch";

const stytch = loadStytch();


export const invite = async (email: string, organization_id: string) => {
  return stytch.magicLinks.email.invite({
    email_address: email,
    organization_id: organization_id,
  });
};

export const deleteMember = async (member_id: string, organization_id: string) => {
  return stytch.organizations.members.delete({
    organization_id,
    member_id,
  });
}

export const getOauthProviderValues = async (organization_id: string, member_id: string) => {
  const handleErr = (err: StytchError) => ({
    error_url: err.error_url,
    error_type: err.error_type,
    error_message: err.error_message,
    status_code: err.status_code,
    request_id: err.request_id,
  })
  return {
    microsoft: await stytch.memberOAuthProviders.microsoft({organization_id, member_id}).catch(handleErr),
    google: await stytch.memberOAuthProviders.google({organization_id, member_id}).catch(handleErr),
    hubspot: await stytch.memberOAuthProviders.hubspot({organization_id, member_id}).catch(handleErr),
    slack: await stytch.memberOAuthProviders.slack({organization_id, member_id}).catch(handleErr),
  }
}