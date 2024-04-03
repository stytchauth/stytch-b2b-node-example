import LoginDiscoveryForm from "@/components/LoginDiscoveryForm";
import { GetServerSideProps } from "next";
import { getDomainFromRequest } from "@/lib/urlUtils";
import CodeSpan from "@/components/CodeSpan";
import Link from "next/link";
import CodeBlock from "@/components/common/CodeBlock";

type Props = { domain: string };

export default function Discovery({ domain }: Props) {
  return (
    <>
      <div style={styles.container}>
        <div style={styles.details} className="bordered">
          <h2>Discovery login flow</h2>
          <p>
            Once you complete one of the authentication methods using the
            component to the right (
            <Link
              href="https://stytch.com/docs/b2b/guides/magic-links/send-discover-eml"
              target="_blank"
            >
              Email Magic Links
            </Link>
            &nbsp;or&nbsp;
            <Link
              href="https://stytch.com/docs/b2b/guides/oauth/discovery"
              target="_blank"
            >
              OAuth
            </Link>
            ), you&apos;ll be able to view which Organizations you have access
            to and choose which one you&apos;d like to log into. If you
            don&apos;t currently have access to any Organizations, you&apos;ll
            be able to create one.
          </p>
          <p>
            We refer to this as the Discovery flow, since the user authenticates
            in order to discover which Organizations they can access.
          </p>
          <p>
            The Discovery flow is usually hosted on a generic login URL
            (like&nbsp;
            <CodeSpan>https://yourdomain.com/login</CodeSpan>), as opposed to
            the Organization flow, which is usually hosted on an
            Organization-specific URL (like&nbsp;
            <CodeSpan>https://yourdomain.com/organization-slug/login</CodeSpan>
            ). If you already know the slug of the Organization that you&apos;d
            like to log into, you can alternatively use the&nbsp;
            <Link href="/organization-lookup">Organization login flow</Link>.
          </p>
          <p>
            Below are some code snippets that power the login component to the
            right.
          </p>
          <CodeBlock
            codeString={`// The "Send login email" button triggers the following Stytch Node SDK method

await stytchClient.magicLinks.email.discovery.send({
  email_address: email,
  discovery_redirect_url: \`\${domain}/api/callback\`,
});

// The OAuth buttons initiate a client-side redirect to the following URL,
// where \${provider} is either 'google' or 'microsoft'

const redirectURL = redirectDomain + "/api/callback";
return \`\${stytchEnv}v1/b2b/public/oauth/\${provider}/discovery/start?
  public_token=\${publicToken}&discovery_redirect_url=\${redirectURL}\`;`}
          />
          <Link href="/">Back</Link>
        </div>
        <div style={styles.component} className="bordered">
          <LoginDiscoveryForm domain={domain} />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  Props,
  { slug: string }
> = async (context) => {
  return {
    props: {
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
