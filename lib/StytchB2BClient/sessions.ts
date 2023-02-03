import { request, MemberSession, fetchConfig, Member } from './base';

import type { BaseResponse } from './base';

export interface GetRequest {
  member_id: string;
}

export interface GetResponse extends BaseResponse {
  sessions: MemberSession[];
}

export interface AuthenticateRequest {
  session_duration_minutes?: number;
  session_token?: string;
  session_jwt?: string;
  session_custom_claims?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface AuthenticateResponse extends BaseResponse {
  session: MemberSession;
  member: Member;
  session_token: string;
  session_jwt: string;
}

export interface RevokeRequest {
  session_id?: string;
  session_token?: string;
  session_jwt?: string;
}

export type RevokeResponse = BaseResponse;

export class Sessions {
  base_path = 'sessions';
  private fetchConfig: fetchConfig;

  constructor(fetchConfig: fetchConfig) {
    this.fetchConfig = fetchConfig;
  }

  private endpoint(path: string): string {
    return `${this.base_path}/${path}`;
  }

  get(params: GetRequest): Promise<GetResponse> {
    return request<GetResponse>(this.fetchConfig, {
      method: 'GET',
      url: this.base_path,
      params: { ...params },
    });
  }

  authenticate(data: AuthenticateRequest): Promise<AuthenticateResponse> {
    return request<AuthenticateResponse>(this.fetchConfig, {
      method: 'POST',
      url: this.endpoint('authenticate'),
      data,
    });
  }

  revoke(data: RevokeRequest): Promise<RevokeResponse> {
    return request(this.fetchConfig, {
      method: 'POST',
      url: this.endpoint('revoke'),
      data,
    });
  }
}
