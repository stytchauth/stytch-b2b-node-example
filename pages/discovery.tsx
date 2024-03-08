import { useState } from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import loadStytch, { DiscoveredOrganizations } from "@/lib/loadStytch";
import { getDiscoverySessionData } from "@/lib/sessionService";

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
      <h1>Select an Organization</h1>
      <p>
        Below, you&apos;ll find a list of Organizations that you can access.
        Select the Organization that you&apos;d like to log into.
      </p>
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
      <h2 className="center">or</h2>
      <div className="section">
        <form method="POST" action="/api/discovery/create">
          <div className="input-row">
            <input
              type={"text"}
              style={{ width: 330, marginRight: 20 }}
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

const Discovery = ({ discovered_organizations }: Props) => {
  return (
    <div className="card">
      <DiscoveredOrganizationsList
        discovered_organizations={discovered_organizations}
      />
      <CreateNewOrganization />
    </div>
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

export default Discovery;
