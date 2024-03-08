import { useAuth, withSession } from "@/lib/sessionService";
import {
  Member,
  OIDCConnection,
  Organization,
  SAMLConnection,
} from "@/lib/loadStytch";
import { findAllMembers, findByID } from "@/lib/orgService";
import { list } from "@/lib/ssoService";
import OrganizationCard from "@/components/OrganizationCard";
import MembersCard from "@/components/MembersCard";
import SSOCard from "@/components/SSOCard";

type Props = {
  org: Organization;
  user: Member;
  members: Member[];
  saml_connections: SAMLConnection[];
  oidc_connections: OIDCConnection[];
};

const Dashboard = ({
  org,
  user,
  members,
  saml_connections,
  oidc_connections,
}: Props) => {
  return (
    <div className="profile-section">
      <OrganizationCard organization={org} />
      <MembersCard organization={org} members={members} currentUser={user} />
      <SSOCard
        currentUser={user}
        saml_connections={saml_connections}
        oidc_connections={oidc_connections}
      />
    </div>
  );
};

export const getServerSideProps = withSession<Props, { slug: string }>(
  async (context) => {
    const { member } = useAuth(context);
    const org = await findByID(member.organization_id);

    if (org === null) {
      return { redirect: { statusCode: 307, destination: `/login` } };
    }

    const [members, ssoConnections] = await Promise.all([
      findAllMembers(org.organization_id),
      list(org.organization_id),
    ]);

    return {
      props: {
        org,
        user: member,
        members,
        saml_connections: ssoConnections.saml_connections ?? [],
        oidc_connections: ssoConnections.oidc_connections ?? [],
      },
    };
  }
);

export default Dashboard;
