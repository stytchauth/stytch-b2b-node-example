import type {NextApiRequest, NextApiResponse} from 'next';
import loadStytch from '../../lib/loadStytch';
import Cookies from 'cookies';
import {SESSION_DURATION_MINUTES, setSession} from "../../lib/sessionService";


const stytchClient = loadStytch();

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = req.query.slug

  try {
    const sessionToken = await exchangeToken(req)
    setSession(req, res, sessionToken)
    // TODO: Should we return the slug here?
    return res.redirect(307, `/${slug}/dashboard`)
  } catch (error) {
    console.error('Could not authenticate in callback', error)

    return res.redirect(307, '/login')
  }
}

async function exchangeToken(req: NextApiRequest): Promise<string> {

  if (req.query.stytch_token_type === 'multi_tenant_magic_links' && req.query.token) {
    return await handleMagicLinkCallback(req)
  }

  if (req.query.stytch_token_type === 'sso' && req.query.token) {
    return await handleSSOCallback(req)
  }

  console.log('No token found in req.query', req.query)

  throw Error('No token found')
}

async function handleMagicLinkCallback(req: NextApiRequest): Promise<string> {
  const authRes = await stytchClient.magicLinks.authenticate(req.query.token as string, {
    session_duration_minutes: SESSION_DURATION_MINUTES
  })

  return authRes.session_jwt as string;
}

async function handleSSOCallback(req: NextApiRequest): Promise<string> {
  const authRes = await stytchClient.sso.authenticate(req.query.token as string, {
    session_duration_minutes: SESSION_DURATION_MINUTES
  })

  return authRes.session_jwt as string;
}


export default handler;
