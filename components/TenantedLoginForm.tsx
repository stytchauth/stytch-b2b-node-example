import {login} from "@/lib/api";
import {
  formatSSOStartURL,
  Organization,
} from "@/lib/loadStytch";
import {EmailLoginForm} from "./EmailLoginForm";
import {OAuthButton, OAuthProviders} from "@/components/OAuthButton";

type Props = {
  org: Organization;
  domain: string;
};
const TenantedLoginForm = ({org, domain}: Props) => {
  return (
    <div className="card">
      <EmailLoginForm
        title={`Log in to ${org.organization_name}`}
        onSubmit={(email) => login(email, org.organization_id)}
      >
        {org.sso_default_connection_id && (
          <div>
            <h2>
              Or, use this organization&apos;s&nbsp;
              <a href={formatSSOStartURL(domain, org.sso_default_connection_id)}>
                Preferred Identity Provider
              </a>
            </h2>
            <br/>
          </div>
        )}
      </EmailLoginForm>
      or
      <OAuthButton providerType={OAuthProviders.Google} hostDomain={domain} orgSlug={org.organization_slug}/>
      <OAuthButton providerType={OAuthProviders.Microsoft} hostDomain={domain} orgSlug={org.organization_slug}/>
      <OAuthButton providerType={OAuthProviders.Hubspot} hostDomain={domain} orgSlug={org.organization_slug}/>
      <OAuthButton providerType={OAuthProviders.Slack} hostDomain={domain} orgSlug={org.organization_slug}/>
      {/*    Login with Google*/}
      {/*</Link>*/}
    </div>
  );
};


export default TenantedLoginForm;
