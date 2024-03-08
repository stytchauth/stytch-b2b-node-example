import { login } from "@/lib/api";
import { formatSSOStartURL, Organization } from "@/lib/loadStytch";
import { EmailLoginForm } from "./EmailLoginForm";
import { OAuthButton, OAuthProviders } from "@/components/OAuthButton";

type Props = {
  org: Organization;
  domain: string;
};
const TenantedLoginForm = ({ org, domain }: Props) => {
  console.log("here: " + JSON.stringify(org));
  return (
    <div className="card">
      <EmailLoginForm
        title={`Log into ${org.organization_name}`}
        onSubmit={(email) => login(email, org.organization_id)}
      >
        <p>
          This is an Organization-specific login page, where you can log into
          the Organization mentioned above.
        </p>
        {org.sso_default_connection_id && (
          <div>
            <h2>
              Or, use this organization&apos;s&nbsp;
              <a
                href={formatSSOStartURL(domain, org.sso_default_connection_id)}
              >
                Preferred Identity Provider
              </a>
            </h2>
            <br />
          </div>
        )}
      </EmailLoginForm>
      <h2 className="center">or</h2>
      <OAuthButton
        providerType={OAuthProviders.Google}
        hostDomain={domain}
        orgSlug={org.organization_slug}
      />
      <OAuthButton
        providerType={OAuthProviders.Microsoft}
        hostDomain={domain}
        orgSlug={org.organization_slug}
      />
    </div>
  );
};

export default TenantedLoginForm;
