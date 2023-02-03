import { MOCK_FETCH_CONFIG, mockRequest } from './testHelpers';
import { SearchOperator } from './base';
import { Members } from './members';

const members = new Members(MOCK_FETCH_CONFIG, 'organizations');

jest.mock('./base');

describe('members.search', () => {
  test('success', () => {
    mockRequest((req) => {
      expect(req).toEqual({
        method: 'POST',
        path: 'organizations/members/search',
        data: {
          limit: 200,
          query: {
            operator: SearchOperator.OR,
            operands: [
              { filter_name: 'member_id', filter_value: 'member-id-1234' },
              { filter_name: 'organization_slug_fuzzy', filter_value: '1234' },
            ],
          },
        },
      });

      const data = {
        request_id: 'request-id-test-55555555-5555-4555-8555-555555555555',
        results: [
          {
            member_id: 'member-id-1234',
          },
        ],
        results_metadata: {
          total: 0,
          next_cursor: null,
        },
        status_code: 200,
      };
      return { status: 200, data };
    });

    return expect(
      members.search({
        limit: 200,
        query: {
          operator: SearchOperator.OR,
          operands: [
            // TODO: should this be an array filter?
            { filter_name: 'member_id', filter_value: 'member-id-1234' },
            { filter_name: 'organization_slug_fuzzy', filter_value: '1234' },
          ],
        },
      }),
    ).resolves.toMatchObject({
      request_id: 'request-id-test-55555555-5555-4555-8555-555555555555',
      results: [
        {
          member_id: 'member-id-1234',
        },
      ],
      results_metadata: {
        total: 0,
        next_cursor: null,
      },
      status_code: 200,
    });
  });
});

describe('members.delete', () => {
  test('success', () => {
    mockRequest((req) => {
      expect(req).toEqual({
        method: 'DELETE',
        path: 'organizations/organization-id-1234/members/member-id-1234',
      });

      const data = {
        request_id: 'request-id-test-55555555-5555-4555-8555-555555555555',
        member_id: 'member-id-1234',
        status_code: 200,
      };
      return { status: 200, data };
    });

    return expect(
      members.delete({
        member_id: 'member-id-1234',
        organization_id: 'organization-id-1234',
      }),
    ).resolves.toMatchObject({
      request_id: 'request-id-test-55555555-5555-4555-8555-555555555555',
      member_id: 'member-id-1234',
      status_code: 200,
    });
  });
});
