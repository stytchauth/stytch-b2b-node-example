import { request, BaseResponse, Member, MemberSession, fetchConfig } from './base';
import { SAML } from './saml';

export interface X509Certificate {
  certificate: string;
  issuer: string;
  created_at: string;
  expires_at: string;
}

export interface SAMLConnection {
  organization_id: string;
  connection_id: string;
  status: string;
  attribute_mapping: Record<string, string>;
  idp_entity_id: string;
  display_name: string;
  idp_sso_url: string;
  acs_url: string;
  audience_uri: string;
  signing_certificates: X509Certificate[];
  verification_certificates: X509Certificate[];
}

export interface GetSSOConnectionsResponse extends BaseResponse {
  saml_connections: SAMLConnection[];
}

export interface DeleteSSOConnectionRequest {
  organization_id: string;
  connection_id: string;
}

export interface DeleteSSOConnectionResponse extends BaseResponse {
  connection_id: string;
}

export interface SSOAuthenticateRequest {
  session_token?: string;
  session_jwt?: string;
  session_duration_minutes?: number;
  session_custom_claims?: Record<string, any>;
  code_verifier?: string;
}

export interface SSOAuthenticateResponse extends BaseResponse {
  member_id: string;
  member: Member;
  organization_id: string;
  method_id: string;
  session_token?: string;
  session_jwt?: string;
  session?: MemberSession;
  reset_session: boolean;
}

export class SSO {
  saml: SAML;

  constructor(private readonly fetchConfig: fetchConfig) {
    this.saml = new SAML(fetchConfig);
  }

  get(organizationID: string): Promise<GetSSOConnectionsResponse> {
    return request(this.fetchConfig, {
      method: 'GET',
      url: `sso/${organizationID}`,
    });
  }

  delete(req: DeleteSSOConnectionRequest): Promise<DeleteSSOConnectionResponse> {
    return request(this.fetchConfig, {
      method: 'DELETE',
      url: `sso/${req.organization_id}/connections/${req.connection_id}`,
    });
  }

  authenticate(token: string, data?: SSOAuthenticateRequest): Promise<SSOAuthenticateResponse> {
    return request(this.fetchConfig, {
      method: 'POST',
      url: `sso/authenticate`,
      data: { token, ...data },
    });
  }
}
