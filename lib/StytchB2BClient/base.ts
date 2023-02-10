// Copied from stytch-node
import * as http from 'http';
import { RequestError, StytchError, StytchErrorJSON } from './errors';
// https://github.com/developit/unfetch/issues/99
import * as fetchImport from 'isomorphic-unfetch';

const fetch = (fetchImport.default || fetchImport) as typeof fetchImport.default;

export interface BaseResponse {
  status_code: number;
  request_id: string;
}

export interface fetchConfig {
  baseURL: string;
  headers: Record<string, string>;
  timeout: number;
  agent?: http.Agent;
}

export type requestConfig = {
  url: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT';
  params?: Record<string, string | number>;
  data?: unknown;
};

export async function request<T>(fetchConfig: fetchConfig, requestConfig: requestConfig): Promise<T> {
  const url = new URL(requestConfig.url, fetchConfig.baseURL);
  if (requestConfig.params) {
    Object.entries(requestConfig.params).forEach(([key, value]) => url.searchParams.append(key, String(value)));
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: requestConfig.method,
      body: JSON.stringify(requestConfig.data),
      ...fetchConfig,
    });
  } catch (e) {
    const err = e as Error;
    throw new RequestError(err.message, requestConfig);
  }

  let responseJSON;
  try {
    responseJSON = await response.json();
  } catch (e) {
    const err = e as Error;
    throw new RequestError(`Unable to parse JSON response from server: ${err.message}`, requestConfig);
  }

  if (response.status >= 400) {
    throw new StytchError(responseJSON as StytchErrorJSON);
  }

  return responseJSON as T;
}

export interface EmailFactor {
  delivery_method: 'email';
  type: string;
  last_authenticated_at: string;
  email_factor: {
    email_id: string;
    email_address: string;
  };
}
export type AuthenticationFactor = EmailFactor;
export interface MemberSession {
  member_session_id: string;
  member_id: string;
  started_at: Date;
  last_accessed_at: Date;
  expires_at: Date;
  authentication_factors: AuthenticationFactor[];
  custom_claims?: Record<string, any>;
}

export interface Member {
  organization_id: string;
  member_id: string;
  email_address: string;
  status: string;
  name: string;
  trusted_metadata: Record<string, any>;
  untrusted_metadata: Record<string, any>;
}

export interface ResultsMetadata {
  total: number;
  next_cursor: string;
}

export enum SearchOperator {
  OR = 'OR',
  AND = 'AND',
}
