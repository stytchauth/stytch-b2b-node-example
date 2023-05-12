import React, {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { OrgService } from "../../lib/orgService";
import {
  createOidcSSOConn,
  createSamlSSOConn,
  deleteMember,
  invite,
} from "../../lib/api";
import { SSOService } from "../../lib/ssoService";
import { useAuth, withSession } from "../../lib/sessionService";
import {
  Member,
  OIDCConnection,
  Organization,
  SAMLConnection,
} from "../../lib/loadStytch";
import { SSO } from "stytch/types/lib/b2b/sso";

type Props = {
  org: Organization;
  user: Member;
  members: Member[];
  saml_connections: SAMLConnection[];
  oidc_connections: OIDCConnection[];
};

const isValidEmail = (emailValue: string) => {
  // Overly simple email address regex
  const regex = /\S+@\S+\.\S+/;
  return regex.test(emailValue);
};

const isAdmin = (member: Member) => !!member.trusted_metadata.admin;

const SSO_METHOD = {
  SAML: "SAML",
  OIDC: "OIDC",
};

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
      [{isAdmin(member) ? "admin" : "member"}] {member.email_address} (
      {member.status}){/* Do not let members delete themselves! */}
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
        <h3>Invite new member</h3>
        <form onSubmit={onInviteSubmit} className="row">
          <input
            placeholder={`your-coworker@${
              org.email_allowed_domains[0] ?? "example.com"
            }`}
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
  oidc_connections,
}: Pick<Props, "user" | "saml_connections" | "oidc_connections">) => {
  const [idpNameSAML, setIdpNameSAML] = useState("");
  const [idpNameOIDC, setIdpNameOIDC] = useState("");
  const [ssoMethod, setSsoMethod] = useState(SSO_METHOD.SAML);
  const router = useRouter();

  const onSamlCreate: FormEventHandler = async (e) => {
    e.preventDefault();
    const res = await createSamlSSOConn(idpNameSAML);
    if (res.status !== 200) {
      alert("Error creating connection");
      return;
    }
    const conn = await res.json();
    await router.push(
      `/${router.query.slug}/dashboard/saml/${conn.connection_id}`
    );
  };

  const onOidcCreate: FormEventHandler = async (e) => {
    e.preventDefault();
    const res = await createOidcSSOConn(idpNameOIDC);
    if (res.status !== 200) {
      alert("Error creating connection");
      return;
    }
    const conn = await res.json();
    await router.push(
      `/${router.query.slug}/dashboard/oidc/${conn.connection_id}`
    );
  };

  const onSsoMethodChange: FormEventHandler = async (e) => {
    // @ts-ignore
    setIsSaml(e.target["value"] == "SAML");
  };

  return (
    <>
      <div className="section">
        <>
          <h2>SSO Connections</h2>
          <h3>SAML</h3>
          {saml_connections.length === 0 && <p>No connections configured.</p>}
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
          <h3>OIDC</h3>
          {oidc_connections.length === 0 && <p>No connections configured.</p>}
          <ul>
            {oidc_connections.map((conn) => (
              <li key={conn.connection_id}>
                <Link
                  href={`/${router.query.slug}/dashboard/oidc/${conn.connection_id}`}
                >
                  <span>
                    {conn.display_name} ({conn.status})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      </div>

      {/*Only admins can create new SSO Connection*/}
      {isAdmin(user) && (
        <div className="section">
          <h3>Create a new SSO Connection</h3>
          <form
            onSubmit={
              ssoMethod === SSO_METHOD.SAML ? onSamlCreate : onOidcCreate
            }
            className="row"
          >
            <input
              type="text"
              placeholder={
                ssoMethod === SSO_METHOD.SAML
                  ? `SAML Display Name`
                  : `OIDC Display Name`
              }
              value={ssoMethod === SSO_METHOD.SAML ? idpNameSAML : idpNameOIDC}
              onChange={
                ssoMethod === SSO_METHOD.SAML
                  ? (e) => setIdpNameSAML(e.target.value)
                  : (e) => setIdpNameOIDC(e.target.value)
              }
            />
            <button
              disabled={
                ssoMethod === SSO_METHOD.SAML
                  ? idpNameSAML.length < 3
                  : idpNameOIDC.length < 3
              }
              type="submit"
              className="primary"
            >
              Create
            </button>
          </form>
          <div className="radio-sso">
            <input
              type="radio"
              id="saml"
              name="sso_method"
              onClick={(e) => setSsoMethod(SSO_METHOD.SAML)}
              checked={ssoMethod === SSO_METHOD.SAML}
            />
            <label htmlFor="saml">SAML</label>
            <input
              type="radio"
              id="oidc"
              onClick={(e) => setSsoMethod(SSO_METHOD.OIDC)}
              checked={ssoMethod === SSO_METHOD.OIDC}
            />
            <label htmlFor="oidc">OIDC</label>
          </div>
        </div>
      )}
    </>
  );
};

const Dashboard = ({
  org,
  user,
  members,
  saml_connections,
  oidc_connections,
}: Props) => {
  return (
    <div className="card">
      <h1>Organization name: {org.organization_name}</h1>
      <p>
        Organization slug: <span className="code">{org.organization_slug}</span>
      </p>
      <p>
        Current user: <span className="code">{user.email_address}</span>
      </p>
      <MemberList org={org} members={members} user={user} />
      <br />
      <IDPList
        user={user}
        saml_connections={saml_connections}
        oidc_connections={oidc_connections}
      />

      <div>
        <Link href={"/orgswitcher"}>Switch Organizations</Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link href={"/api/logout"}>Log Out</Link>
      </div>
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
        saml_connections: ssoConnections.saml_connections ?? [],
        oidc_connections: ssoConnections.oidc_connections ?? [],
      },
    };
  }
);

export default Dashboard;
