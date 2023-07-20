import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import loadStytch, { Member, SessionsAuthenticateResponse } from "./loadStytch";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext, PreviewData } from "next/types";
import { IncomingMessage, ServerResponse } from "http";

export const SESSION_DURATION_MINUTES = 60;
export const INTERMEDIATE_SESSION_DURATION_MINUTES = 10;

const SESSION_SYMBOL = Symbol("session");
const SESSION_COOKIE = "session";
const INTERMEDIATE_SESSION_COOKIE = "intermediate_session";

const stytch = loadStytch();

export function setSession(
  req: NextApiRequest,
  res: NextApiResponse,
  sessionJWT: string
) {
  const cookies = new Cookies(req, res);
  cookies.set(SESSION_COOKIE, sessionJWT, {
    httpOnly: true,
    maxAge: 1000 * 60 * SESSION_DURATION_MINUTES, // minutes to milliseconds
  });
}

export function clearSession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = new Cookies(req, res);
  cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    maxAge: 0, // minutes to milliseconds
  });
}

export function setIntermediateSession(
  req: NextApiRequest,
  res: NextApiResponse,
  intermediateSessionToken: string
) {
  const cookies = new Cookies(req, res);
  cookies.set(INTERMEDIATE_SESSION_COOKIE, intermediateSessionToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * INTERMEDIATE_SESSION_DURATION_MINUTES, // minutes to milliseconds
  });
}

export function clearIntermediateSession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = new Cookies(req, res);
  cookies.set(INTERMEDIATE_SESSION_COOKIE, "", {
    httpOnly: true,
    maxAge: 0, // minutes to milliseconds
  });
}

type DiscoverySessionData =
  | {
      sessionJWT: string;
      intermediateSession: undefined;
      isDiscovery: false;
      error: false;
    }
  | {
      sessionJWT: undefined;
      intermediateSession: string;
      isDiscovery: true;
      error: false;
    }
  | { error: true };

export function getDiscoverySessionData(
  req: IncomingMessage,
  res: ServerResponse
): DiscoverySessionData {
  const cookies = new Cookies(req, res);
  const sessionJWT = cookies.get("session");
  if (sessionJWT) {
    return {
      sessionJWT,
      intermediateSession: undefined,
      isDiscovery: false,
      error: false,
    };
  }

  const intermediateSession = cookies.get("intermediate_session");
  if (intermediateSession) {
    return {
      sessionJWT: undefined,
      intermediateSession,
      isDiscovery: true,
      error: false,
    };
  }
  return { error: true };
}

type APIHandler = (
  member: Member,
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<NextApiResponse | void>;

/**
 * adminOnlyAPIRoute wraps an API handler and ensures that the caller has a valid session
 * The caller's member object is passed to the API handler
 * @param apiHandler
 */
export function adminOnlyAPIRoute(apiHandler: APIHandler) {
  return async function WrappedHandler(
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const cookies = new Cookies(req, res);
    const sessionJWT = cookies.get(SESSION_COOKIE);

    if (!sessionJWT) {
      console.log("No session JWT found...");
      return res.status(401).end();
    }

    console.log(sessionJWT);

    let sessionAuthRes;
    try {
      sessionAuthRes = await stytch.sessions.authenticate({
        session_duration_minutes: 30, // extend the session a bit
        session_jwt: sessionJWT,
      });
    } catch (err) {
      console.error("Could not find member by session token", err);
      return res.status(401).end();
    }

    console.log(sessionAuthRes);
    // Stytch issues a new JWT on every authenticate call - store it on the UA for faster validation next time
    setSession(req, res, sessionAuthRes.session_jwt);

    const isAdmin = sessionAuthRes.member.trusted_metadata.admin as boolean;
    if (!isAdmin) {
      console.error("Member is not authorized to call route");
      return res.status(403).end();
    }

    return apiHandler(sessionAuthRes.member, req, res);
  };
}

/**
 * withSession wraps a page's getServerSideProps function
 * and ensures that the caller has a valid session
 * The member is stored on the ServerSide Props context and can be retrieved with {@link useAuth}
 */
export function withSession<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
>(handler: GetServerSideProps<P, Q, D>): GetServerSideProps<P, Q, D> {
  return async function (context) {
    const cookies = new Cookies(context.req, context.res);
    const sessionJWT = cookies.get("session");

    if (!sessionJWT) {
      console.log("No session JWT found...");
      return { redirect: { statusCode: 307, destination: `/login` } };
    }

    let sessionAuthRes;
    try {
      sessionAuthRes = await stytch.sessions.authenticate({
        session_duration_minutes: 30, // extend the session a bit
        session_jwt: sessionJWT,
      });
    } catch (err) {
      console.error("Could not find member by session token", err);
      return { redirect: { statusCode: 307, destination: `/login` } };
    }

    // Hide the session authentication result on the context
    // callers can find it using useAuth
    // @ts-ignore
    context[SESSION_SYMBOL] = sessionAuthRes;

    return handler(context);
  };
}

/**
 * useAuth will return the authentication result for the logged-in user.
 * It can only be called in functions wrapped with {@link withSession}`
 * @param context
 */
export function useAuth(
  context: GetServerSidePropsContext
): SessionsAuthenticateResponse {
  // @ts-ignore
  if (!context[SESSION_SYMBOL]) {
    throw Error("useAuth called in route not protected by withSession");
  }
  // @ts-ignore
  return context[SESSION_SYMBOL] as AuthenticateResponse;
}

export function revokeSession(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);
  const sessionJWT = cookies.get(SESSION_COOKIE);
  if (!sessionJWT) {
    return;
  }
  // Delete the session cookie by setting maxAge to 0
  cookies.set(SESSION_COOKIE, "", { maxAge: 0 });
  // Call Stytch in the background to terminate the session
  // But don't block on it!
  stytch.sessions
    .revoke({ session_jwt: sessionJWT })
    .then(() => {
      console.log("Session successfully revoked");
    })
    .catch((err) => {
      console.error("Could not revoke session", err);
    });
}
