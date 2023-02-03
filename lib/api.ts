export const signup = async (email: string, organization_name: string) =>
  fetch('/api/signup', {
    method: 'POST',
    body: JSON.stringify({
      email,
      organization_name
    }),
  });

export const login = async (email: string, organization_id: string) =>
  fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      organization_id
    }),
  });

export const invite = async (email: string) =>
  fetch('/api/invite', {
    method: 'POST',
    body: JSON.stringify({
      email
    }),
  });

export const deleteMember = async (member_id: string) =>
  fetch('/api/delete_member', {
    method: 'POST',
    body: JSON.stringify({
      member_id
    }),
  });

export const createSamlSSOConn = async (display_name: string) =>
  fetch('/api/sso/create', {
    method: 'POST',
    body: JSON.stringify({
      display_name
    }),
  });

export const updateSamlSSOConn = async (
  {
    display_name,
    idp_sso_url,
    idp_entity_id,
    email_attribute,
    first_name_attribute,
    last_name_attribute,
    certificate,
    connection_id
  }: {
    display_name: string;
    idp_sso_url: string;
    idp_entity_id: string;
    email_attribute: string;
    first_name_attribute: string;
    last_name_attribute: string;
    certificate: string;
    connection_id: string;
  }
) =>
  fetch('/api/sso/update', {
    method: 'POST',
    body: JSON.stringify({
      display_name,
      idp_sso_url,
      idp_entity_id,
      email_attribute,
      first_name_attribute,
      last_name_attribute,
      certificate,
      connection_id
    }),
  });