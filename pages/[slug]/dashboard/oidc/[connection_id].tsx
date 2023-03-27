import { OrgService } from '../../../../lib/orgService';
import { SSOService } from '../../../../lib/ssoService';
import React, { FormEventHandler } from 'react';
import { updateOidcSSOConn } from '../../../../lib/api';
import { useRouter } from 'next/router';
import { formatSSOStartURL, OIDCConnection } from '../../../../lib/loadStytch';
import { useAuth, withSession } from '../../../../lib/sessionService';
import Link from 'next/link';

type Props = { connection: OIDCConnection };

function ConnectionEditPage({ connection }: Props) {
  const router = useRouter();

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);

    await updateOidcSSOConn({
      connection_id: connection.connection_id,
      display_name: data.get('display_name') as string,
      client_id: data.get('client_id') as string,
      client_secret: data.get('client_secret') as string,
      issuer: data.get('issuer') as string,
      authorization_url: data.get('authorization_url') as string,
      token_url: data.get('token_url') as string,
      userinfo_url: data.get('userinfo_url') as string,
      jwks_url: data.get('jwks_url') as string,
    });

    // Force a reload to refresh the conn list
    await router.replace(router.asPath);
  };

  return (
    <>
      <div className="card">
        <form onSubmit={onSubmit} style={{ minWidth: 400 }}>
          <h1>Edit OIDC Connection</h1>
          <label htmlFor="display_name">Display Name</label>
          <input name="display_name" value={connection.display_name} disabled />
          <label htmlFor="status">Status</label>
          <input name="status" disabled value={connection.status} />
          <label htmlFor="client_id">Client ID</label>
          <input name="client_id" placeholder="Client ID" defaultValue={connection.client_id} />
          <label htmlFor="client_secret">Client Secret</label>
          <input name="client_secret" placeholder="Client Secret" defaultValue={connection.client_secret} />
          <label htmlFor="issuer">Issuer</label>
          <input name="issuer" placeholder="Issuer" defaultValue={connection.issuer} />
          <label htmlFor="authorization_url">Authorization URL</label>
          <input name="authorization_url" placeholder="Authorization URL" defaultValue={connection.authorization_url} />
          <label htmlFor="token_url">Token URL</label>
          <input name="token_url" placeholder="Token URL" defaultValue={connection.authorization_url} />
          <label htmlFor="userinfo_url">User Info URL</label>
          <input name="userinfo_url" placeholder="User Info URL" defaultValue={connection.userinfo_url} />
          <label htmlFor="jwks_url">Jwks URL</label>
          <input name="jwks_url" placeholder="Jwks URL" defaultValue={connection.jwks_url} />
          <button className="primary" type="submit">
            Save
          </button>
        </form>
        <a style={{ minWidth: 400, margin: 10 }} href={formatSSOStartURL(connection.connection_id)}>
          <button className="secondary">Test connection</button>
        </a>
        <Link style={{ marginRight: 'auto' }} href={`/${router.query.slug}/dashboard`}>
          Back
        </Link>
      </div>
    </>
  );
}

export const getServerSideProps = withSession<Props, { slug: string; connection_id: string }>(async (context) => {
  const connection_id = context.params!['connection_id'];
  const { member } = useAuth(context);

  const org = await OrgService.findByID(member.organization_id);
  if (org === null) {
    return { redirect: { statusCode: 307, destination: `/login` } };
  }

  const connection = await SSOService.list(org.organization_id).then((res) => {
    console.log('response here get: ' + JSON.stringify(res));
    return res.oidc_connections.find((conn) => conn.connection_id === connection_id);
  });

  if (!connection) {
    return {
      redirect: {
        statusCode: 307,
        destination: `/${org.organization_slug}/dashboard`,
      },
    };
  }

  return {
    props: { connection },
  };
});

export default ConnectionEditPage;
