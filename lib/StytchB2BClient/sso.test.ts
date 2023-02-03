import { SSO } from './sso';
import { MOCK_FETCH_CONFIG } from './testHelpers';
import { request } from './base';

jest.mock('./base');
beforeEach(() => {
  (request as jest.Mock).mockReset();
  (request as jest.Mock).mockImplementation((_, config) => {
    return Promise.resolve({
      method: config.method,
      path: config.url,
      data: config.data,
      params: config.params,
    });
  });
});

const sso = new SSO(MOCK_FETCH_CONFIG);

describe('sso.get', () => {
  test('success', () => {
    return expect(sso.get('organization-id-1234')).resolves.toMatchObject({
      method: 'GET',
      path: 'sso/organization-id-1234',
    });
  });
});

describe('sso.authenticate', () => {
  test('session', () => {
    return expect(
      sso.authenticate('DOYoip3rvIMMW5lgItikFK-Ak1CfMsgjuiCyI7uuU94=', {
        session_token: 'mZAYn5aLEqKUlZ_Ad9U_fWr38GaAQ1oFAhT8ds245v7Q',
        session_duration_minutes: 60,
      }),
    ).resolves.toMatchObject({
      method: 'POST',
      path: 'sso/authenticate',
      data: {
        token: 'DOYoip3rvIMMW5lgItikFK-Ak1CfMsgjuiCyI7uuU94=',
        session_token: 'mZAYn5aLEqKUlZ_Ad9U_fWr38GaAQ1oFAhT8ds245v7Q',
        session_duration_minutes: 60,
      },
    });
  });
  test('no session', () => {
    return expect(sso.authenticate('DOYoip3rvIMMW5lgItikFK-Ak1CfMsgjuiCyI7uuU94=')).resolves.toMatchObject({
      method: 'POST',
      path: 'sso/authenticate',
      data: {
        token: 'DOYoip3rvIMMW5lgItikFK-Ak1CfMsgjuiCyI7uuU94=',
      },
    });
  });
});

describe('sso.delete', () => {
  test('success', () => {
    return expect(
      sso.delete({ organization_id: 'organization-id-1234', connection_id: 'saml-connection-id-1234' }),
    ).resolves.toMatchObject({
      method: 'DELETE',
      path: 'sso/organization-id-1234/connections/saml-connection-id-1234',
    });
  });
});
