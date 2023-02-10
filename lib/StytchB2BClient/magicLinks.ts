import { request, MemberSession, Member } from './base';

import type { BaseResponse, fetchConfig } from './base';

export interface LoginOrSignupByEmailRequest {
  organization_id: string;
  email_address: string;
  login_redirect_url?: string;
  signup_redirect_url?: string;
  pkce_code_challenge?: string;
  login_template_id?: string;
  signup_template_id?: string;
}

export interface LoginOrSignupByEmailResponse extends BaseResponse {
  member_id: string;
  member: Member;
  member_creared: boolean;
}

export interface InviteByEmailRequest {
  organization_id: string;
  email_address: string;
  name?: string;
  invite_redirect_url?: string;
  invited_by_member_id?: string;
  invite_template_id?: string;
  trusted_metadata?: Record<string, any>;
  untrusted_metadata?: Record<string, any>;
}

export interface InviteByEmailResponse extends BaseResponse {
  member_id: string;
  member: Member;
}

export interface AuthenticateRequest {
  session_token?: string;
  session_jwt?: string;
  session_duration_minutes?: number;
  session_custom_claims?: Record<string, any>;
  pkce_code_verifier?: string;
}

export interface AuthenticateResponse extends BaseResponse {
  member_id: string;
  member: Member;
  organization_id: string;
  method_id: string;
  session_token?: string;
  session_jwt?: string;
  session?: MemberSession;
  reset_sessions: boolean;
}

class Email {
  base_path: string;
  delivery = 'email';

  private fetchConfig: fetchConfig;

  constructor(fetchConfig: fetchConfig, parent_path: string) {
    this.fetchConfig = fetchConfig;
    this.base_path = `${parent_path}`;
  }

  private endpoint(path: string): string {
    return `${this.base_path}/${this.delivery}/${path}`;
  }

  loginOrSignup(data: LoginOrSignupByEmailRequest): Promise<LoginOrSignupByEmailResponse> {
    return request(this.fetchConfig, {
      method: 'POST',
      url: this.endpoint('login_or_signup'),
      data,
    });
  }

  invite(data: InviteByEmailRequest): Promise<InviteByEmailResponse> {
    return request(this.fetchConfig, {
      method: 'POST',
      url: this.endpoint('invite'),
      data,
    });
  }
}

export class MagicLinks {
  base_path = 'magic_links';
  email: Email;

  private fetchConfig: fetchConfig;

  constructor(fetchConfig: fetchConfig) {
    this.fetchConfig = fetchConfig;
    this.email = new Email(fetchConfig, this.base_path);
  }

  private endpoint(path: string): string {
    return `${this.base_path}/${path}`;
  }

  authenticate(magic_links_token: string, data?: AuthenticateRequest): Promise<AuthenticateResponse> {
    return request<AuthenticateResponse>(this.fetchConfig, {
      method: 'POST',
      url: this.endpoint('authenticate'),
      data: { magic_links_token, ...data },
    });
  }
}
