import { BaseResponse, request, fetchConfig } from './base';
import { SAMLConnection } from './sso';

export interface CreateSAMLConnectionRequest {
  display_name?: string;
}

export interface CreateSAMLConnectionResponse extends BaseResponse {
  connection: SAMLConnection;
}

export interface UpdateSAMLConnectionRequest {
  idp_entity_id?: string;
  display_name?: string;
  attribute_mapping?: Record<string, string>;
  x509_certificate?: string;
  idp_sso_url?: string;
}

export interface UpdateSAMLConnectionResponse extends BaseResponse {
  connection: SAMLConnection;
}

export interface DeleteSAMLVerificationCertificateRequest {
  organization_id: string;
  connection_id: string;
  certificate_id: string;
}

export interface DeleteSAMLVerificationCertificateResponse extends BaseResponse {
  certificate_id: string;
}

export class SAML {
  constructor(private readonly fetchConfig: fetchConfig) {}

  create(organizationID: string, data: CreateSAMLConnectionRequest): Promise<CreateSAMLConnectionResponse> {
    return request(this.fetchConfig, {
      method: 'POST',
      url: `sso/saml/${organizationID}`,
      data,
    });
  }

  update(
    organizationID: string,
    connectionID: string,
    data: UpdateSAMLConnectionRequest,
  ): Promise<UpdateSAMLConnectionResponse> {
    return request(this.fetchConfig, {
      method: 'PUT',
      url: `sso/saml/${organizationID}/connections/${connectionID}`,
      data,
    });
  }

  deleteVerificationCertificate(
    req: DeleteSAMLVerificationCertificateRequest,
  ): Promise<DeleteSAMLVerificationCertificateResponse> {
    return request(this.fetchConfig, {
      method: 'DELETE',
      url: `sso/saml/${req.organization_id}/connections/${req.connection_id}/verification_certificates/${req.certificate_id}`,
    });
  }
}
