import React, {
  EventHandler,
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { OrgService } from "../../lib/orgService";
import {
  Organization,
  Organizations,
} from "../../lib/StytchB2BClient/organizations";
import { Member } from "../../lib/StytchB2BClient/base";
import { createSamlSSOConn, deleteMember, invite, login } from "../../lib/api";
import { SSOService } from "../../lib/ssoService";
import { SAMLConnection } from "../../lib/StytchB2BClient/sso";
import { useAuth, withSession } from "../../lib/sessionService";

type Props = {
  org: Organization;
  user: Member;
  members: Member[];
  saml_connections: SAMLConnection[];
};

const STATUS = {
  INIT: 0,
  SENT: 1,
  ERROR: 2,
};

const isValidEmail = (emailValue: string) => {
  // Overly simple email address regex
  const regex = /\S+@\S+\.\S+/;
  return regex.test(emailValue);
};

const isAdmin = (member: Member) => !!member.trusted_metadata.admin;

const MemberRow = ({ member, user }: { member: Member; user: Member }) => {
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);
  const doDelete: MouseEventHandler = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    await deleteMember(member.member_id);
    // Force a reload to refresh the user list
    router.replace(router.asPath);
    // TODO: Success toast?
  };

  const canDelete =
    /* Do not let members delete themselves! */
    member.member_id !== user.member_id &&
    /* Only admins can delete! */
    isAdmin(user);

  const deleteButton = (
    <button disabled={isDisabled} onClick={doDelete}>
      Delete User
    </button>
  );

  return (
    <li>
      {member.email_address} ({member.status})
      {/* Do not let members delete themselves! */}
      {canDelete ? deleteButton : null}
    </li>
  );
};

const MemberList = ({
  members,
  user,
  org,
}: Pick<Props, "members" | "user" | "org">) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(!isValidEmail(email));
  }, [email]);

  const onInviteSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    // Disable button right away to prevent sending emails twice
    if (isDisabled) {
      return;
    } else {
      setIsDisabled(true);
    }
    await invite(email);
    // Force a reload to refresh the user list
    router.replace(router.asPath);
  };

  return (
    <>
      <div className="section">
        <h2>Members</h2>
        <ul>
          {members.map((member) => (
            <MemberRow key={member.member_id} member={member} user={user} />
          ))}
        </ul>
      </div>

      <div className="section">
        <h2>Invite new member</h2>
        <form onSubmit={onInviteSubmit} className="row">
          <input
            placeholder={`your-coworker@${org.email_allowed_domains[0]}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <button className="primary" disabled={isDisabled} type="submit">
            Invite
          </button>
        </form>
      </div>
    </>
  );
};

const IDPList = ({
  user,
  saml_connections,
}: Pick<Props, "user" | "saml_connections">) => {
  const [idpName, setIDPName] = useState("");
  const router = useRouter();

  const onCreate: FormEventHandler = async (e) => {
    e.preventDefault();
    const res = await createSamlSSOConn(idpName);
    const conn = await res.json();
    await router.push(
      `/${router.query.slug}/dashboard/saml/${conn.connection_id}`
    );
  };

  return (
    <>
      <p>SSO Connections:</p>
      <ul>
        {saml_connections.map((conn) => (
          <li key={conn.connection_id}>
            <Link
              href={`/${router.query.slug}/dashboard/saml/${conn.connection_id}`}
            >
              <span>
                {conn.display_name} ({conn.status})
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <br />
      {/*Only admins can create new SSO IDPs*/}
      {isAdmin(user) && (
        <form onSubmit={onCreate}>
          <input
            placeholder={`Okta Account`}
            value={idpName}
            onChange={(e) => setIDPName(e.target.value)}
          />
          <br />
          <button disabled={idpName.length < 3} type="submit">
            Create New SSO IDP
          </button>
          <br />
          <br />
        </form>
      )}
    </>
  );
};

const Dashboard = ({ org, user, members, saml_connections }: Props) => {
  return (
    <div className="card">
      <h1>{org.organization_name}</h1>
      <MemberList org={org} members={members} user={user} />
      <br />
      <IDPList user={user} saml_connections={saml_connections} />

      <Link href={"/api/logout"}>Log Out</Link>
    </div>
  );
};

export const getServerSideProps = withSession<Props, { slug: string }>(
  async (context) => {
    const { member } = useAuth(context);
    const org = await OrgService.findByID(member.organization_id);

    if (org === null) {
      return { redirect: { statusCode: 307, destination: `/login` } };
    }

    const [members, ssoConnections] = await Promise.all([
      OrgService.findAllMembers(org.organization_id),
      SSOService.list(org.organization_id),
    ]);

    return {
      props: {
        org,
        user: member,
        members,
        saml_connections: ssoConnections.saml_connections,
      },
    };
  }
);

export default Dashboard;
