import { useState } from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import loadStytch, { DiscoveredOrganizations } from "@/lib/loadStytch";
import { getDiscoverySessionData } from "@/lib/sessionService";
import CodeBlock from "@/components/common/CodeBlock";
import CodeSpan from "@/components/CodeSpan";

type Props = {
  discovered_organizations: DiscoveredOrganizations;
};

const DiscoveredOrganizationsList = ({ discovered_organizations }: Props) => {
  const formatMembership = ({
    membership,
    organization,
  }: Pick<DiscoveredOrganizations[0], "membership" | "organization">) => {
    if (membership?.type === "pending_member") {
      return `Join ${organization?.organization_name}`;
    }
    if (membership?.type === "eligible_to_join_by_email_domain") {
      return `Join ${organization?.organization_name}`;
    }
    if (membership?.type === "invited_member") {
      return `Accept invitation to ${organization?.organization_name}`;
    }
    return `Log into ${organization?.organization_name}`;
  };

  return (
    <div className="section">
      <h2>Select an Organization</h2>
      <p>Select the Organization that you&apos;d like to log into.</p>
      {discovered_organizations.length === 0 && (
        <p>No existing organizations.</p>
      )}
      <ul>
        {discovered_organizations.map(({ organization, membership }) => (
          <li key={organization?.organization_id}>
            <Link href={`/api/discovery/${organization?.organization_id}`}>
              <span>{formatMembership({ organization, membership })}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CreateNewOrganization = () => {
  const [orgName, setOrgName] = useState("");
  const [requireMFA, setRequireMFA] = useState(false);
  return (
    <>
      <h3 style={styles.h3}>or</h3>
      <div className="section">
        <form method="POST" action="/api/discovery/create">
          <div className="input-row">
            <input
              type={"text"}
              style={{ width: 250, marginRight: 20 }}
              placeholder={`Organization name`}
              name="organization_name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
            <div className="radio-sso">
              <input
                type="radio"
                id="require_mfa"
                name="require_mfa"
                onClick={(e) => setRequireMFA(!requireMFA)}
                checked={requireMFA}
              />
              <label htmlFor="require_mfa">Require MFA</label>
            </div>
          </div>
          <button
            disabled={orgName.length < 3}
            type="submit"
            className="primary full-width"
          >
            Create a new Organization
          </button>
        </form>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const discoverySessionData = getDiscoverySessionData(
    context.req,
    context.res
  );
  if (discoverySessionData.error) {
    console.log("No session tokens found...");
    return { redirect: { statusCode: 307, destination: `/login` } };
  }

  const { discovered_organizations } =
    await loadStytch().discovery.organizations.list({
      intermediate_session_token: discoverySessionData.intermediateSession,
      session_jwt: discoverySessionData.sessionJWT,
    });

  console.log(discovered_organizations);

  return {
    props: {
      discovered_organizations,
    },
  };
};

const Discovery = ({ discovered_organizations }: Props) => {
  return (
    <>
      <div style={styles.container}>
        <div style={styles.details} className="bordered">
          <h2>Discovery flow Organization selection</h2>
          <p>
            Now that you&apos;ve successfully authenticated, we surface a list of
            Organizations that you have access to. This list includes
            Organizations that you&apos;ve already joined, have been invited to, or
            are eligible to join through JIT provisioning based on your email
            domain (as long as there&apos;s at least one other active Member in the
            Organization with the same email domain).
          </p>
          <p>
            Once you select an Organization, we&apos;ll exchange the&nbsp;
            <CodeSpan>intermediate_session_token</CodeSpan>&nbsp; that was
            returned during the Discovery flow for a&nbsp;
            <CodeSpan>session_token</CodeSpan>&nbsp; specific to the
            Organization that you select.
          </p>
          <p>
            Below are some code snippets that power the component to the right.
          </p>
          <CodeBlock
            codeString={`// When a user selects an existing Organization, we call the following
// backend Stytch Node SDK method

stytchClient.discovery.intermediateSessions.exchange({
  intermediate_session_token: discoverySessionData.intermediateSession,
  organization_id: orgId,
  session_duration_minutes: SESSION_DURATION_MINUTES,
});

// When a user creates a new Organization, we call the following backend
// Stytch Node SDK method

stytchClient.discovery.organizations.create({
  intermediate_session_token: intermediateSession,
  email_allowed_domains: [],
  organization_name: organization_name,
  session_duration_minutes: SESSION_DURATION_MINUTES,
  mfa_policy: require_mfa ? "REQUIRED_FOR_ALL" : "OPTIONAL",
  organization_slug: organization_slug,
});
`}
          />
          <Link href="/organization-lookup">Back</Link>
        </div>
        <div style={styles.component} className="bordered">
          <div>
            <DiscoveredOrganizationsList
              discovered_organizations={discovered_organizations}
            />
            <CreateNewOrganization />
          </div>
        </div>
      </div>
    </>
  );
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
  h3: {
    display: "flex",
    justifyContent: "center",
  },
};

export default Discovery;
