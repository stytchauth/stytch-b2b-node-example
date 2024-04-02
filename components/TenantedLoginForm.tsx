import { login } from "@/lib/api";
import { formatSSOStartURL, Organization } from "@/lib/loadStytch";
import { EmailLoginForm } from "./EmailLoginForm";
import { OAuthButton, OAuthProviders } from "@/components/OAuthButton";

type Props = {
  org: Organization;
  domain: string;
};
const TenantedLoginForm = ({ org, domain }: Props) => {
  return (
    <div>
      <EmailLoginForm
        title={`Log into ${org.organization_name}`}
        onSubmit={(email) => login(email, org.organization_id)}
      >
        <p>Enter your email address below to receive a login email.</p>
      </EmailLoginForm>
      <h3 style={styles.h3}>or</h3>
      <div className="section">
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
      <h3 style={styles.h3}>or</h3>
      {org.sso_default_connection_id && (
        <div>
          <p>
            Use this organization&apos;s&nbsp;
            <a href={formatSSOStartURL(domain, org.sso_default_connection_id)}>
              Preferred Identity Provider
            </a>
          </p>
          <br />
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  h3: {
    display: "flex",
    justifyContent: "center",
  },
};

export default TenantedLoginForm;
