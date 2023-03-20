import React, {
  useState,
} from "react";
import Link from "next/link";
import {GetServerSideProps} from "next";
import loadStytch, {PossibleOrganizations} from "../lib/loadStytch";
import {getDiscoverySessionData} from "../lib/sessionService";

type Props = {
  possible_organizations: PossibleOrganizations,
  is_discovery: boolean,
};

const PossibleOrganizationsList = ({
                                     possible_organizations
                                   }: Pick<Props, "possible_organizations">) => {
  return (
    <div className="section">
      <h3>Your Organizations</h3>
      {possible_organizations.length === 0 && <p>No existing organizations.</p>}
      <ul>
        {possible_organizations.map(({organization, member}) => (
          <li key={organization.organization_id}>
            <Link
              href={`/api/discovery/${organization.organization_id}`}
            >
              {/*TODO: reference _how_ the join is possible - invites or some other mechanism?*/}
              <span>
                    {member ? 'Continue to' : 'Join'} {organization.organization_name}
                  </span>
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
          placeholder={`Foo Corp`}
          name="organization_name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />
        <button
          disabled={orgName.length < 3}
          type="submit"
          className="primary"
        >
          Create
        </button>
      </form>
    </div>
  )
}

const Discovery = ({possible_organizations, is_discovery}: Props) => {
  return (
    <div className="card">
      {!is_discovery && (<h3>Organization Switcher</h3>)}
      <PossibleOrganizationsList possible_organizations={possible_organizations}/>
      {is_discovery && <CreateNewOrganization/>}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const discoverySessionData = getDiscoverySessionData(context.req, context.res);
  if (discoverySessionData.error) {
      console.log('No session tokens found...');
      return { redirect: { statusCode: 307, destination: `/login` } };
  }

  const {possible_organizations} = await loadStytch().discovery.memberships({
    intermediate_session_token: discoverySessionData.intermediateSession,
    session_jwt: discoverySessionData.sessionJWT,
  });

  return {
    props: {
      possible_organizations,
      is_discovery: discoverySessionData.isDiscovery,
    },
  };
};

export default Discovery;
