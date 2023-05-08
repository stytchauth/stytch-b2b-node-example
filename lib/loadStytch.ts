import * as stytch from "stytch";

let client: stytch.B2BClient;

export const publicToken = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;

const stytchEnv = 'fooobar';
  // process.env.NEXT_PUBLIC_STYTCH_PROJECT_ENV === "live"
  //   ? stytch.envs.live
  //   : stytch.envs.test;

export const formatSSOStartURL = (connection_id: string): string => {
  return `${stytchEnv}public/sso/start?connection_id=${connection_id}&public_token=${publicToken}`;
};


const loadStytch = () => {
  if (!client) {
    client = new stytch.B2BClient({
      project_id: process.env.STYTCH_PROJECT_ID || "",
      secret: process.env.STYTCH_SECRET || "",
      env: stytchEnv,
    });
  }

  return client;
};

export default loadStytch;
