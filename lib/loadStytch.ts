import * as stytch from './StytchB2BClient';

let client: stytch.Client;

// export const publicToken = 'public-token-live-cf43b964-c802-4f0d-aafe-7e64d88d692f';

const loadStytch = () => {
  if (!client) {

    client = new stytch.Client({
      project_id: 'project-live-72e7ded9-ce12-424c-8051-bdd6b548538e',
      secret: 'secret-live-bW757-x-bRwuGxhHK8GXJ3yRZ5e2pez35nc=',
      env: 'https://api.max.dev.stytch.com/v1/b2b/',

      // TODO: Replace with env vars - no hardcoding
      // project_id: process.env.STYTCH_PROJECT_ID || '',
      // secret: process.env.STYTCH_SECRET || '',
      // env: process.env.STYTCH_PROJECT_ENV === 'live' ? stytch.envs.live : stytch.envs.test,
    });
  }

  return client;
};

export default loadStytch;
