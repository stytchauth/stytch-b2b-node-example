import { BaseResponse, Member, SearchOperator, ResultsMetadata, request, fetchConfig } from './base';

export type MemberSearchOperand =
  | {
      filter_name: 'member_id';
      filter_value: string;
    }
  | {
      filter_name: 'member_emails';
      filter_value: string[];
    }
  | {
      filter_name: 'member_email_fuzzy';
      filter_value: string;
    }
  | {
      filter_name: 'organization_id';
      filter_value: string;
    }
  | {
      filter_name: 'organization_slug';
      filter_value: string;
    }
  | {
      filter_name: 'organization_slug_fuzzy';
      filter_value: string;
    }
  | {
      filter_name: 'status';
      filter_value: 'active' | 'pending';
    };

export interface SearchOrganizationMemberRequest {
  organization_ids: string[];
  limit?: number;
  query?: {
    operator: SearchOperator;
    operands: MemberSearchOperand[];
  };
  cursor?: string | null;
}

export interface SearchOrganizationMemberResponse extends BaseResponse {
  members: Member[];
  results_metadata: ResultsMetadata;
}

export interface DeleteMemberRequest {
  member_id: string;
  organization_id: string;
}

export interface DeleteMemberResponse extends BaseResponse {
  member_id: string;
}

export class Members {
  private base_path: string;
  private fetchConfig: fetchConfig;

  constructor(fetchConfig: fetchConfig, parent_path: string) {
    this.fetchConfig = fetchConfig;
    this.base_path = `${parent_path}`;
  }

  delete(req: DeleteMemberRequest): Promise<DeleteMemberResponse> {
    return request(this.fetchConfig, {
      method: 'DELETE',
      // TODO: This URL is wrong
      url: `${this.base_path}/${req.organization_id}/member/${req.member_id}`,
    });
  }

  search(data: SearchOrganizationMemberRequest): Promise<SearchOrganizationMemberResponse> {
    return request(this.fetchConfig, {
      method: 'POST',
      url: `${this.base_path}/members/search`,
      data,
    });
  }
}
