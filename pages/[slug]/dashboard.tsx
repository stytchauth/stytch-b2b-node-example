import React, {EventHandler, FormEventHandler, MouseEventHandler, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Link from "next/link";
import {GetServerSideProps} from "next";
import {OrgService} from "../../lib/orgService";
import {Organization, Organizations} from "../../lib/StytchB2BClient/organizations";
import Cookies from "cookies";
import {MemberService} from "../../lib/memberService";
import {Member} from "../../lib/StytchB2BClient/base";
import {createSamlSSOConn, deleteMember, invite, login} from "../../lib/api";
import {SSOService} from "../../lib/ssoService";
import {SAMLConnection} from "../../lib/StytchB2BClient/sso";

type Props = {
  org: Organization,
  user: Member,
  members: Member[],
  saml_connections: SAMLConnection[],
}

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


const DeleteButton = ({member}: { member: Member }) => {
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false)
  const doDelete: MouseEventHandler = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    await deleteMember(member.member_id);
    // Force a reload to refresh the user list
    router.replace(router.asPath)
    // TODO: Success toast?
  }

  return <button disabled={isDisabled} onClick={doDelete}>Delete User</button>
}

const MemberList = ({members, user, org}: Pick<Props, 'members'| 'user'| 'org'>) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(!isValidEmail(email))
  }, [email])

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
    router.replace(router.asPath)
  }

  return (
    <>
      <p>
        Users:
      </p>
      <ul>
        {members.map(member => (
          <li key={member.member_id}>
            {member.email_address} ({member.status})
            {/* Do not let members delete themselves! */}
            {member.member_id !== user.member_id ? <DeleteButton member={member}/> : null}
          </li>
        ))}
      </ul>
      <br/>
      <form onSubmit={onInviteSubmit}>
        <input
          style={styles.emailInput}
          placeholder={`your-coworker@${org.email_allowed_domains[0]}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <br/>
        <button disabled={isDisabled} type="submit">Invite New User</button>
      </form>
    </>
  )
}

const IDPList = ({org, saml_connections}: Pick<Props, 'org'| 'saml_connections'>) => {
  const [idpName, setIDPName] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const router = useRouter()

  const onCreate: FormEventHandler = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    const res = await createSamlSSOConn(idpName)
    const conn = await res.json();
    await router.push(`/${router.query.slug}/dashboard/saml/${conn.connection_id}`)
  }

  return (
    <>
      <ul>
        {saml_connections.map(conn => (
          <li key={conn.connection_id}>
            <Link href={`/${router.query.slug}/dashboard/saml/${conn.connection_id}`}>
              <span>{conn.display_name} ({conn.status})</span>
            </Link>
          </li>
        ))}
      </ul>
      <br/>
      <form onSubmit={onCreate}>
        <input
          style={styles.emailInput}
          placeholder={`Okta Account`}
          value={idpName}
          onChange={(e) => setIDPName(e.target.value)}
        />
        <br/>
        <button disabled={idpName.length < 3} type="submit">Create New SSO IDP</button>
      </form>
    </>
  )
}

const Dashboard = ({org, user, members, saml_connections}: Props) => {
  return (
    <div style={{padding: '24px 40px'}}>
      <h2>{org.organization_name}</h2>
      <MemberList org={org} members={members} user={user}/>
      <br/>
      <IDPList org={org} saml_connections={saml_connections}/>

      <Link href={"/api/logout"}>Log Out</Link>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  loginRow: {
    display: 'flex',
    marginTop: '24px',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  emailInput: {
    width: '300px',
    fontSize: '18px',
    marginBottom: '8px',
  },
};


export const getServerSideProps: GetServerSideProps<Props, { slug: string }> = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const sessionToken = cookies.get("session")
  const slug = context.params!['slug'];

  if (!sessionToken) {
    console.log('No session token found...')
    return {redirect: {statusCode: 307, destination: `/${slug}/login`}}
  }

  const [org, user] = await Promise.all([
    OrgService.findBySlug(slug),
    MemberService.findBySessionToken(sessionToken),
  ])

  if (org === null || user === null) {
    return {redirect: {statusCode: 307, destination: `/${slug}/login`}}
  }

  const [members, ssoConnections] = await Promise.all([
    OrgService.findAllMembers(org.organization_id),
    SSOService.list(org.organization_id),
  ]);


  return {
    props: {org, user, members, saml_connections: ssoConnections.saml_connections}
  }
}


export default Dashboard;
