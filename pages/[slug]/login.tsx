import Link from "next/link";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import TenantedLoginForm from "@/components/TenantedLoginForm";
import { findBySlug } from "@/lib/orgService";
import { Organization } from "@/lib/loadStytch";
import { getDomainFromRequest } from "@/lib/urlUtils";
import CodeBlock from "@/components/common/CodeBlock";

type Props = { org: null | Organization; domain: string };

const TenantedLogin = ({ org, domain }: Props) => {
  const router = useRouter();
  const slug = router.query["slug"];

  if (org == null) {
    return (
      <div className="card">
        <div>
          <h2>Organization not found</h2>
          <p>
            No organization with the slug <strong>{slug}</strong> was found.
          </p>
          <Link href={"/organization-lookup"}>
            <button className="primary full-width" id="button">
              Try again
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={styles.container}>
        <div style={styles.details} className="bordered">
          <h2>Organization login flow</h2>
          <p>
            You&apos;re now on your Organization&apos;s unique login page (note the
            Organization slug in the URL path). You can use the component to the
            right to log into this Organization using&nbsp;
            <Link
              href="https://stytch.com/docs/b2b/guides/magic-links/send-login-or-signup-eml"
              target="_blank"
            >
              Email Magic Links
            </Link>
            ,&nbsp;
            <Link
              href="https://stytch.com/docs/b2b/guides/oauth/login"
              target="_blank"
            >
              OAuth
            </Link>
            , or&nbsp;
            <Link
              href="https://stytch.com/docs/b2b/api/sso-authenticate-start"
              target="_blank"
            >
              SSO
            </Link>
            &nbsp;(if your Organization has any active SSO Connections).
          </p>
          <p>
            Note that&nbsp;
            <Link
              href="https://stytch.com/docs/b2b/guides/passwords/api"
              target="_blank"
            >
              Passwords
            </Link>
            &nbsp;are also supported as part of Stych&apos;s Organization flow (not
            implemented as part of this example app).
          </p>
          <p>
            Below are some code snippets that power the login component to the
            right.
          </p>
          <CodeBlock
            codeString={`// The "Send login email" button triggers the following Stytch Node SDK method

await stytchClient.magicLinks.email.loginOrSignup({
  email_address: email,
  organization_id: organization_id,
  login_redirect_url: \`\${domain}/api/callback\`,
  signup_redirect_url: \`\${domain}/api/callback\`,
});

// The OAuth buttons initiate a client-side redirect to the following URL,
// where \${provider} is either 'google' or 'microsoft'

const redirectURL = redirectDomain + "/api/callback";
return \`\${stytchEnv}v1/b2b/public/oauth/\${provider}/start?
  public_token=\${publicToken}&slug=\${org_slug}&
  login_redirect_url=\${redirectURL}&signup_redirect_url=\${redirectURL}\`;

// The "Preferred Identity Provider" SSO link initiates a redirect to the
// following URL, where \${connection_id} is the Organization's default
// SSO Connection ID

const redirectURL = redirectDomain + "/api/callback";
return \`\${stytchEnv}v1/public/sso/start?connection_id=\${connection_id}
  &public_token=\${publicToken}&login_redirect_url=\${redirectURL}
  &signup_redirect_url=\${redirectURL}\`;
`}
          />
          <Link href="/organization-lookup">Back</Link>
        </div>
        <div style={styles.component} className="bordered">
          <TenantedLoginForm org={org} domain={domain} />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { slug: string }
> = async (context) => {
  const slug = context.params!["slug"];
  return {
    props: {
      org: await findBySlug(slug),
      domain: getDomainFromRequest(context.req),
    },
  };
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    margin: "48px 24px",
    flexWrap: "wrap-reverse",
    justifyContent: "center",
    alignItems: "top",
    gap: "48px",
  },
  details: {
    backgroundColor: "#FFF",
    padding: "48px",
    flexBasis: "600px",
    flexGrow: 1,
    maxWidth: "1000px",
  },
  component: {
    padding: "48px",
    maxWidth: "500px",
  },
};

export default TenantedLogin;
