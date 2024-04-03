import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "@/lib/loadStytch";
import {
  SESSION_DURATION_MINUTES,
  setIntermediateSession,
  setSession,
} from "@/lib/sessionService";

const stytchClient = loadStytch();

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = req.query.slug;

  try {
    const exchangeResult = await exchangeToken(req);
    // TODO: Should we return the slug here?
    if (exchangeResult.kind === "login") {
      setSession(req, res, exchangeResult.token);
      return res.redirect(307, `/${slug}/dashboard`);
    } else {
      setIntermediateSession(req, res, exchangeResult.token);
      return res.redirect(307, `/select-organization`);
    }
  } catch (error) {
    console.error("Could not authenticate in callback", error);
    return res.redirect(307, "/login");
  }
}
type ExchangeResult = { kind: "discovery" | "login"; token: string };
async function exchangeToken(req: NextApiRequest): Promise<ExchangeResult> {
  if (
    req.query.stytch_token_type === "multi_tenant_magic_links" &&
    req.query.token
  ) {
    return await handleMagicLinkCallback(req);
  }

  if (req.query.stytch_token_type === "sso" && req.query.token) {
    return await handleSSOCallback(req);
  }

  if (req.query.stytch_token_type === "discovery" && req.query.token) {
    return await handleEmailMagicLinksDiscoveryCallback(req);
  }

  if (req.query.stytch_token_type === "discovery_oauth" && req.query.token) {
    return await handleOAuthDiscoveryCallback(req);
  }

  if (req.query.stytch_token_type === "oauth" && req.query.token) {
    return await handleOAuthCallback(req);
  }

  console.log("No token found in req.query", req.query);
  throw Error("No token found");
}

async function handleMagicLinkCallback(
  req: NextApiRequest
): Promise<ExchangeResult> {
  const authRes = await stytchClient.magicLinks.authenticate({
    magic_links_token: req.query.token as string,
    session_duration_minutes: SESSION_DURATION_MINUTES,
  });

  return {
    kind: "login",
    token: authRes.session_jwt as string,
  };
}

async function handleSSOCallback(req: NextApiRequest): Promise<ExchangeResult> {
  const authRes = await stytchClient.sso.authenticate({
    sso_token: req.query.token as string,
    session_duration_minutes: SESSION_DURATION_MINUTES,
  });

  return {
    kind: "login",
    token: authRes.session_jwt as string,
  };
}

async function handleEmailMagicLinksDiscoveryCallback(
  req: NextApiRequest
): Promise<ExchangeResult> {
  const authRes = await stytchClient.magicLinks.discovery.authenticate({
    discovery_magic_links_token: req.query.token as string,
  });

  return {
    kind: "discovery",
    token: authRes.intermediate_session_token as string,
  };
}

async function handleOAuthDiscoveryCallback(
  req: NextApiRequest
): Promise<ExchangeResult> {
  const authRes = await stytchClient.oauth.discovery.authenticate({
    discovery_oauth_token: req.query.token as string,
  });

  return {
    kind: "discovery",
    token: authRes.intermediate_session_token as string,
  };
}

async function handleOAuthCallback(
  req: NextApiRequest
): Promise<ExchangeResult> {
  const authRes = await stytchClient.oauth.authenticate({
    oauth_token: req.query.token as string,
    session_duration_minutes: SESSION_DURATION_MINUTES,
  });

  return {
    kind: "login",
    token: authRes.session_jwt as string,
  };
}

export default handler;
