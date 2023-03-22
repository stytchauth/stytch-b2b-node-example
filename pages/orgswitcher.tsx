import React, {
  useState,
} from "react";
import Link from "next/link";
import {GetServerSideProps} from "next";
import loadStytch, {Member, DiscoveredOrganizations} from "../lib/loadStytch";
import {getDiscoverySessionData, useAuth, withSession} from "../lib/sessionService";

type Props = {
  discovered_organizations: DiscoveredOrganizations,
  user: Member,
};

const OrgSwitcherList = ({
                           discovered_organizations,
                           user,
                         }: Props) => {
  return (
    <div className="section">
      <h3>Your Organizations</h3>
      <ul>
        {discovered_organizations
          .map(({organization}) => (
            <li key={organization.organization_id}>
              <Link
                href={`/api/discovery/${organization.organization_id}`}
              >
                <span>{organization.organization_name}</span>
                {organization.organization_id === user.organization_id && (
                  <span>&nbsp;(Active)</span>
                )}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

const OrgSwitcher = (props: Props) => {
  return (
    <div className="card">
      <OrgSwitcherList {...props}/>
    </div>
  );
};

export const getServerSideProps = withSession<Props>(async (context) => {
  const {member} = useAuth(context);
  const discoverySessionData = getDiscoverySessionData(context.req, context.res);
  if (discoverySessionData.error) {
    console.log('No session tokens found...');
    return {redirect: {statusCode: 307, destination: `/login`}};
  }

  const {discovered_organizations} = await loadStytch().discovery.organizations.list({
    intermediate_session_token: discoverySessionData.intermediateSession,
    session_jwt: discoverySessionData.sessionJWT,
  });

  return {
    props: {
      user: member,
      discovered_organizations,
    },
  };
});

export default OrgSwitcher;
