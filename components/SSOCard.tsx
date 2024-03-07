import { createSamlSSOConn, createOidcSSOConn } from "@/lib/api";
import { Member, OIDCConnection, SAMLConnection } from "@/lib/loadStytch";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";

type Props = {
  currentUser: Member;
  saml_connections: SAMLConnection[];
  oidc_connections: OIDCConnection[];
};

const SSO_METHOD = {
  SAML: "SAML",
  OIDC: "OIDC",
};

const isAdmin = (member: Member) => !!member.trusted_metadata.admin;

const IDPList = ({
  currentUser,
  saml_connections,
  oidc_connections,
}: Pick<Props, "currentUser" | "saml_connections" | "oidc_connections">) => {
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
        <h2>SAML</h2>
        {saml_connections.length === 0 && <p>No connections configured.</p>}
        <ul>
          {saml_connections.map((conn) => (
            <li key={conn.connection_id}>
              <Link
                href={`/${router.query.slug}/dashboard/saml/${conn.connection_id}`}
              >
                <button className="primary small">Edit</button>
              </Link>
              <span>
                &nbsp;<span className="code">{conn.display_name}</span> (
                {conn.status})&nbsp;
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>OIDC</h2>
        {oidc_connections.length === 0 && <p>No connections configured.</p>}
        <ul>
          {oidc_connections.map((conn) => (
            <li key={conn.connection_id}>
              <Link
                href={`/${router.query.slug}/dashboard/oidc/${conn.connection_id}`}
              >
                <button className="primary small">Edit</button>
              </Link>
              <span>
                &nbsp;<span className="code">{conn.display_name}</span> (
                {conn.status})
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/*Only admins can create new SSO Connection*/}
      {isAdmin(currentUser) && (
        <div className="section">
          <h2>Create a new SSO Connection</h2>
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
                  ? `SAML display name`
                  : `OIDC display name`
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
              style={{ width: 200 }}
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

const SSOCard = ({
  currentUser,
  saml_connections,
  oidc_connections,
}: Pick<Props, "currentUser" | "saml_connections" | "oidc_connections">) => {
  return (
    <div className="card profile-card">
      <h1>SSO Connections</h1>
      <p>Create and configure SSO Connections for this Organization below.</p>
      <IDPList
        currentUser={currentUser}
        saml_connections={saml_connections}
        oidc_connections={oidc_connections}
      />
    </div>
  );
};

export default SSOCard;
