import { useState } from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import loadStytch, { DiscoveredOrganizations } from "../lib/loadStytch";
import { getDiscoverySessionData } from "../lib/sessionService";

type Props = {
  discovered_organizations: DiscoveredOrganizations;
};

const DiscoveredOrganizationsList = ({ discovered_organizations }: Props) => {
  const formatMembership = ({
    membership,
    organization,
  }: Pick<DiscoveredOrganizations[0], "membership" | "organization">) => {
    if (membership.type === "pending_member") {
      return `Join ${organization.organization_name}`;
    }
    if (membership.type === "eligible_to_join_by_email_domain") {
      return `Join ${organization.organization_name} via your ${membership.details.domain} email`;
    }
    if (membership.type === "invited_member") {
      return `Accept Invite for ${organization.organization_name}`;
    }
    return `Continue to ${organization.organization_name}`;
  };

  return (
    <div className="section">
      <h3>Your Organizations</h3>
      {discovered_organizations.length === 0 && (
        <p>No existing organizations.</p>
      )}
      <ul>
        {discovered_organizations.map(({ organization, membership }) => (
          <li key={organization.organization_id}>
            <Link href={`/api/discovery/${organization.organization_id}`}>
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
  return (
    <div className="section">
      <h3>Or, create a new Organization</h3>

      <form method="POST" action="/api/discovery/create" className="row">
        <label htmlFor="organization_name">Organization name</label>
        <input
          type={"text"}
          placeholder={`Foo Corp`}
          name="organization_name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />
        <button disabled={orgName.length < 3} type="submit" className="primary">
          Create
        </button>
      </form>
    </div>
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
