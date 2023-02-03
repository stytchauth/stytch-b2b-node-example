import {GetServerSideProps} from "next";
import Cookies from "cookies";
import {OrgService} from "../../../../lib/orgService";
import {MemberService} from "../../../../lib/memberService";
import {SSOService} from "../../../../lib/ssoService";
import {SAMLConnection} from "../../../../lib/StytchB2BClient/sso";
import React, {FormEvent, FormEventHandler} from "react";
import {updateSamlSSOConn} from "../../../../lib/api";
import {useRouter} from "next/router";

type Props = { connection: SAMLConnection }

function ConnectionEditPage({connection}: Props) {
  const router = useRouter();

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault()
    const data = new FormData(e.target as HTMLFormElement)

    await updateSamlSSOConn({
      certificate: data.get('certificate') as string,
      connection_id: connection.connection_id,
      display_name: data.get('display_name') as string,
      email_attribute: data.get('email_attribute') as string,
      first_name_attribute: data.get('first_name_attribute') as string,
      idp_entity_id: data.get('idp_entity_id') as string,
      idp_sso_url: data.get('idp_sso_url') as string,
      last_name_attribute: data.get('last_name_attribute') as string,
    })

    // Force a reload to refresh the conn list
    router.replace(router.asPath)
  }

  return (
    <>
      <div style={styles.container}>
        <form onSubmit={onSubmit} style={{minWidth: 600}}>
          <h1>Edit SAML Connection</h1>
          <label htmlFor="display_name">Display Name</label>
          <input
            name="display_name"
            defaultValue={connection.display_name}
            style={styles.input}
          />
          <br/>
          <label htmlFor="status">Status</label>
          <input
            name="status"
            disabled
            defaultValue={connection.status}
            style={styles.input}
          />
          <br/>
          <label htmlFor="acs_url">ACS URL</label>
          <input
            name="acs_url"
            disabled
            defaultValue={connection.acs_url}
            style={styles.input}
          />
          <br/>
          <label htmlFor="audience_uri">Audience URI</label>
          <input
            name="audience_uri"
            disabled
            defaultValue={connection.audience_uri}
            style={styles.input}
          />
          <br/>
          <label htmlFor="idp_sso_url">SSO URL</label>
          <input
            name="idp_sso_url"
            placeholder="https://idp.com/sso/start"
            defaultValue={connection.idp_sso_url}
            style={styles.input}
          />
          <br/>
          <label htmlFor="idp_entity_id">IDP Entity ID</label>
          <input
            name="idp_entity_id"
            placeholder="https://idp.com/sso/start"
            defaultValue={connection.idp_entity_id}
            style={styles.input}
          />
          <br/>
          <label htmlFor="email_attribute">Email Attribute</label>
          <input
            name="email_attribute"
            placeholder="NameID"
            defaultValue={connection.attribute_mapping['email']}
            style={styles.input}
          />
          <br/>
          <label htmlFor="first_name_attribute">First Name Attribute</label>
          <input
            name="first_name_attribute"
            placeholder="firstName"
            defaultValue={connection.attribute_mapping['first_name']}
            style={styles.input}
          />
          <br/>
          <label htmlFor="last_name_attribute">Last Name Attribute</label>
          <input
            name="last_name_attribute"
            placeholder="lastName"
            defaultValue={connection.attribute_mapping['last_name']}
            style={styles.input}
          />
          <br/>
          <label htmlFor="certificate">Signing Certificate</label>
          <textarea
            name="certificate"
            placeholder="-------BEGIN ------"
            defaultValue={connection.verification_certificates[0]?.certificate}
            style={styles.input}
          />
          <br/>
          <a href={`https://api.max.dev.stytch.com/v1/public/sso/start?connection_id=${connection.connection_id}&public_token=${"public-token-live-cf43b964-c802-4f0d-aafe-7e64d88d692f"}`}>
            Test
          </a>
          <br/>
          <button type="submit">Save</button>
        </form>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props, { slug: string, connection_id: string }> = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const sessionToken = cookies.get("session")
  const slug = cookies.get("slug")
  const connection_id = context.params!['connection_id'];

  if (!sessionToken) {
    console.log('No session token found...')
    return {redirect: {statusCode: 307, destination: `/${slug}/login`}}
  }

  const org = await OrgService.findBySlug(slug as string);

  if (org === null) {
    return {redirect: {statusCode: 307, destination: `/${slug}/login`}}
  }

  const connection = await SSOService.list(org.organization_id)
    .then(res => res.saml_connections.find(conn => conn.connection_id === connection_id))

  if (!connection) {
    return {redirect: {statusCode: 307, destination: `/${slug}/dashboard`}}
  }

  return {
    props: {connection}
  }
}

export default ConnectionEditPage

const styles = {
  container: {
    display: 'flex',
    margin: '48px 24px',
    justifyContent: 'center',
    gap: '48px',
  },
  input: {
    width: '100%'
  }
}