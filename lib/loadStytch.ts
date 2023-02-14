import * as stytch from './StytchB2BClient';

let client: stytch.Client;

export const publicToken = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;

const loadStytch = () => {
  if (!client) {
    client = new stytch.Client({
      project_id: process.env.STYTCH_PROJECT_ID || '',
      secret: process.env.STYTCH_SECRET || '',
      // TODO: Clean up https:// work around once backend SDK is available
      env: process.env.STYTCH_PROJECT_ENV?.startsWith('https://')
        ? process.env.STYTCH_PROJECT_ENV
        : process.env.STYTCH_PROJECT_ENV === 'live'
        ? stytch.envs.live
        : stytch.envs.test,
    });
  }

  return client;
};

export default loadStytch;
