import * as stytch from "stytch";
import { BaseResponse, fetchConfig, requestConfig } from 'stytch/types/lib/shared';
import { Member, MemberSession } from 'stytch/types/lib/b2b/shared_b2b';
import { Organization } from 'stytch/types/lib/b2b/organizations';

const request = async <T extends unknown>(
  fetchConfig: fetchConfig,
  requestConfig: requestConfig,
): Promise<T> => {
  const url = new URL(requestConfig.url, fetchConfig.baseURL);

  if (requestConfig.params) {
    Object.entries(requestConfig.params).forEach(([key, value]) => url.searchParams.append(key, String(value)));
  }

  let response;

  try {
    response = await fetch(url.toString(), {
      method: requestConfig.method,
      body: JSON.stringify(requestConfig.data),
      ...fetchConfig,
    });
  } catch (e) {
    const err = e;
    // @ts-ignore
    throw new stytch.RequestError(err.message, requestConfig);
  }

  let responseJSON;

  try {
    responseJSON = await response.json();
  } catch (e) {
    const err = e;
    // @ts-ignore
    throw new stytch.RequestError(`Unable to parse JSON response from server: ${err.message}`, requestConfig);
  }

  if (response.status >= 400) {
    throw new stytch.StytchError(responseJSON);
  }

  return responseJSON;
};


export interface MembershipsRequest {
  intermediate_session_token?: string;
  session_token?: string;
  session_jwt?: string;
}

export interface MembershipsResponse extends BaseResponse {
  email_address: string;
  possible_organizations: PossibleOrganization[];
}

export interface OrganizationRequest {
  intermediate_session_token: string;
  organization: Organization;
  session_duration_minutes?: number;
  session_custom_claims?: Record<string, any>;
}

export interface OrganizationResponse extends BaseResponse {
  member_id: string;
  member_session: MemberSession;
  session_token: string;
  session_jwt: string;
  member: Member;
  organization: Organization;
}

export interface SessionRequest {
  intermediate_session_token: string;
  organization_id: string;
  session_duration_minutes?: number;
  session_custom_claims?: Record<string, any>;
}

export interface SessionResponse extends BaseResponse {
  member_id: string;
  member_session: MemberSession;
  session_token: string;
  session_jwt: string;
  member: Member;
}

export interface SessionExchangeRequest {
  organization_id: string;
  session_token?: string;
  session_jwt?: string;
}

export interface SessionExchangeResponse extends BaseResponse {
  member_id: string;
  member_session: MemberSession;
  session_token: string;
  session_jwt: string;
  member: Member;
}

export interface PossibleOrganization {
  organization: Organization;
  member: Member;
}

/*
The Discovery Magic Link interfaces will eventually live
in the magic link class instead
*/

export interface DiscoveryEmailSendRequest {
  email_address: string;
  discovery_redirect_url?: string;
  pkce_code_challenge?: string;
}

export interface DiscoveryAuthenticateRequest {
  intermediate_magic_links_token: string;
  pkce_code_verifier?: string;
}

export interface DiscoveryAuthenticateResponse extends BaseResponse {
  intermediate_session_token: string;
  email_address: string;
  possible_organizations: PossibleOrganization[];
}

export class Discovery {
  private fetchConfig: fetchConfig;

  constructor(fetchConfig: fetchConfig) {
    this.fetchConfig = fetchConfig;
  }

  memberships(data: MembershipsRequest): Promise<MembershipsResponse> {
    return request<MembershipsResponse>(this.fetchConfig, {
      method: 'POST',
      url: 'b2b/discovery/memberships',
      data,
    });
  }

  organization(data: OrganizationRequest): Promise<OrganizationResponse> {
    return request<OrganizationResponse>(this.fetchConfig, {
      method: 'POST',
      url: 'b2b/discovery/organization',
      data,
    });
  }

  session(data: SessionRequest): Promise<SessionResponse> {
    return request<SessionResponse>(this.fetchConfig, {
      method: 'POST',
      url: 'b2b/discovery/session',
      data,
    });
  }

  sessionExchange(data: SessionExchangeRequest): Promise<SessionExchangeResponse> {
    return request<SessionExchangeResponse>(this.fetchConfig, {
      method: 'POST',
      url: 'b2b/discovery/session/exchange',
      data,
    });
  }

  /*
  The Discovery Magic Link endpoints will eventually live
  in the magic link class instead, i.e.
  stytch.magiclinks.email.discoveryEmailSend
  */

  discoveryEmailSend(data: DiscoveryEmailSendRequest): Promise<BaseResponse> {
    return request<BaseResponse>(this.fetchConfig, {
      method: 'POST',
      url: 'b2b/discovery/magic_links/email/send',
      data,
    });
  }

  discoveryAuthenticate(data: DiscoveryAuthenticateRequest): Promise<DiscoveryAuthenticateResponse> {
    return request<DiscoveryAuthenticateResponse>(this.fetchConfig, {
      method: 'POST',
      url: 'b2b/discovery/magic_links/authenticate',
      data,
    });
  }
}
