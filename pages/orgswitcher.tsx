import Link from "next/link";
import loadStytch, { Member, DiscoveredOrganizations } from "@/lib/loadStytch";
import {
  getDiscoverySessionData,
  useAuth,
  withSession,
} from "@/lib/sessionService";
import CodeBlock from "@/components/common/CodeBlock";
import CodeSpan from "@/components/CodeSpan";

type Props = {
  discovered_organizations: DiscoveredOrganizations;
  user: Member;
};

const OrgSwitcherList = ({ discovered_organizations, user }: Props) => {
  return (
    <div className="section">
      <h2>Log into a different organization</h2>
      <p>
        Log into one of the below organizations by exchanging your current
        session.
      </p>
      <ul>
        {discovered_organizations.map(({ organization }) => (
          <li key={organization?.organization_id}>
            <Link href={`/api/discovery/${organization?.organization_id}`}>
              <span>{organization?.organization_name}</span>
              {organization?.organization_id === user.organization_id && (
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
    <>
      <div style={styles.container}>
        <div style={styles.details} className="bordered">
          <h2>Organization switcher</h2>
          <p>
            Your user can exchange their active session in order to log into a
            different Organization that they belong to. Your user may be
            required to complete additional authentication (like MFA or
            Passwords) if the Organization that they&apos;re switching to requires
            it.
          </p>
          <p>Below is a code snippet that powers the component to the right.</p>
          <CodeBlock
            codeString={`// When a user selects an existing Organization, we call the following
// backend Stytch Node SDK method, where discoverySessionData.sessionJWT
// is a JWT corresponding to the user's current active session

stytchClient.sessions.exchange({
  organization_id: orgId,
  session_jwt: discoverySessionData.sessionJWT,
});
`}
          />
          <Link href="/organization-lookup">Back</Link>
        </div>
        <div style={styles.component} className="bordered">
          <OrgSwitcherList {...props} />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = withSession<Props>(async (context) => {
  const { member } = useAuth(context);
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

  return {
    props: {
      user: member,
      discovered_organizations,
    },
  };
});

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

export default OrgSwitcher;
