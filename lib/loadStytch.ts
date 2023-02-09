import * as stytch from './StytchB2BClient';

let client: stytch.Client;

export const publicToken = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;

const loadStytch = () => {
  if (!client) {

    client = new stytch.Client({
      project_id: process.env.STYTCH_PROJECT_ID || '',
      secret: process.env.STYTCH_SECRET || '',
      // TODO: Point at Prod
      env: 'https://api.staging.stytch.com/v1/b2b/',
      // env: process.env.STYTCH_PROJECT_ENV === 'live' ? stytch.envs.live : stytch.envs.test,
    });
  }

  return client;
};

export default loadStytch;
