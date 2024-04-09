import { findByID } from "@/lib/orgService";
import { FormEventHandler } from "react";
import { updateOidcSSOConn } from "@/lib/api";
import { useRouter } from "next/router";
import { formatSSOStartURL } from "@/lib/loadStytch";
import { OIDCConnection } from "stytch";
import { useAuth, withSession } from "@/lib/sessionService";
import Link from "next/link";
import { list } from "@/lib/ssoService";
import { getDomainFromRequest } from "@/lib/urlUtils";

type Props = { connection: OIDCConnection; domain: string };

function ConnectionEditPage({ connection, domain }: Props) {
  const router = useRouter();

  // @ts-ignore
  const urlSectionClick = (e) => {
    e.preventDefault();
    var panel = e.target.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  };

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);

    await updateOidcSSOConn({
      connection_id: connection.connection_id,
      display_name: data.get("display_name") as string,
      client_id: data.get("client_id") as string,
      client_secret: data.get("client_secret") as string,
      issuer: data.get("issuer") as string,
      authorization_url: data.get("authorization_url") as string,
      token_url: data.get("token_url") as string,
      userinfo_url: data.get("userinfo_url") as string,
      jwks_url: data.get("jwks_url") as string,
    });

    // Force a reload to refresh the conn list
    await router.replace(router.asPath);
  };

  return (
    <>
      <div className="card">
        <form onSubmit={onSubmit} style={{ minWidth: 400 }}>
          <h1>Edit OIDC Connection</h1>
          <label htmlFor="display_name">Display name</label>
          <input
            type="text"
            name="display_name"
            value={connection.display_name}
            disabled
          />
          <label htmlFor="status">Status</label>
          <input type="text" name="status" disabled value={connection.status} />
          <label htmlFor="connection_id">Connection ID</label>
          <input
            type="text"
            name="connection_id"
            value={connection.connection_id}
            disabled
          />
          <label htmlFor="redirect_url">Redirect URL</label>
          <input
            type="text"
            name="redirect_url"
            value={connection.redirect_url}
            disabled
          />
          <label htmlFor="client_id">Client ID</label>
          <input
            type="text"
            name="client_id"
            placeholder="Client ID"
            defaultValue={connection.client_id}
          />
          <label htmlFor="client_secret">Client secret</label>
          <input
            type="text"
            name="client_secret"
            placeholder="Client secret"
            defaultValue={connection.client_secret}
          />
          <label htmlFor="issuer">Issuer URL</label>
          <input
            type="text"
            name="issuer"
            placeholder="Issuer"
            defaultValue={connection.issuer}
          />
          <hr />
          <h5>
            If you provide a valid Issuer URL using an IDP that supports a
            well-known configuration page, the following endpoints will be
            auto-populated.
          </h5>
          <button className="accordion" onClick={urlSectionClick}>
            <span>Endpoints</span>
            <span>
              <b>+</b>
            </span>
          </button>
          <div className="panel">
            <div className={"panel-contents"}>
              <label htmlFor="authorization_url">Authorization URL</label>
              <input
                type="text"
                name="authorization_url"
                placeholder="Authorization URL"
                defaultValue={connection.authorization_url}
              />
              <label htmlFor="token_url">Token URL</label>
              <input
                type="text"
                name="token_url"
                placeholder="Token URL"
                defaultValue={connection.token_url}
              />
              <label htmlFor="userinfo_url">User Info URL</label>
              <input
                type="text"
                name="userinfo_url"
                placeholder="User Info URL"
                defaultValue={connection.userinfo_url}
              />
              <label htmlFor="jwks_url">JWKS URL</label>
              <input
                type="text"
                name="jwks_url"
                placeholder="JWKS URL"
                defaultValue={connection.jwks_url}
              />
            </div>
          </div>
          <button className="primary full-width" type="submit">
            Save
          </button>
        </form>
        <div className="section">
          <a href={formatSSOStartURL(domain, connection.connection_id)}>
            <button className="primary full-width">Test connection</button>
          </a>
        </div>
        <Link
          style={{ marginRight: "auto" }}
          href={`/${router.query.slug}/dashboard`}
        >
          Back
        </Link>
      </div>
    </>
  );
}

export const getServerSideProps = withSession<
  Props,
  { slug: string; connection_id: string }
>(async (context) => {
  const connection_id = context.params!["connection_id"];
  const { member } = useAuth(context);

  const org = await findByID(member.organization_id);
  if (org === null) {
    return { redirect: { statusCode: 307, destination: `/` } };
  }

  const connection = await list(org.organization_id).then((res) => {
    return res.oidc_connections.find(
      (conn) => conn.connection_id === connection_id
    );
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
    props: {
      connection: connection,
      domain: getDomainFromRequest(context.req),
    },
  };
});

export default ConnectionEditPage;
