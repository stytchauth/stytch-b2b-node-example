import type {NextApiRequest, NextApiResponse} from 'next';
import loadStytch from '../../lib/loadStytch';
import Cookies from 'cookies';


const sessionDurationMinutes = 60; // 60 minutes

const stytchClient = loadStytch();

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.query);
  const slug = req.query.slug

  const cookies = new Cookies(req, res);
  try {
    const sessionToken = await exchangeToken(req)
    cookies.set('session', sessionToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * sessionDurationMinutes, // minutes to milliseconds
    })
    cookies.set('slug', slug as string, {
      maxAge: 1000 * 60 * sessionDurationMinutes, // minutes to milliseconds
    })


    // TODO: Should we return the slug here?
    return res.redirect(307, `/${slug}/dashboard`)
  } catch (error) {
    console.error('Could not authenticate in callback', error)

    return res.redirect(307, '/login')
  }
}

async function exchangeToken(req: NextApiRequest): Promise<string> {
  // TODO: This is changing to req.query.magic_link_token....
  if (req.query.stytch_token_type === 'multi_tenant_magic_links' && req.query.token) {
    return await handleMagicLinkCallback(req)
  }
  if (req.query.stytch_token_type === 'sso' && req.query.token) {
    return await handleSSOCallback(req)
  }
  // TODO: SSO
  throw Error('No token found')
}

async function handleMagicLinkCallback(req: NextApiRequest): Promise<string> {
  const authRes = await stytchClient.magicLinks.authenticate(req.query.token as string, {
    session_duration_minutes: sessionDurationMinutes
  })

  return authRes.session_token as string;
}

async function handleSSOCallback(req: NextApiRequest): Promise<string> {
  const authRes = await stytchClient.sso.authenticate(req.query.token as string, {
    session_duration_minutes: sessionDurationMinutes
  })

  return authRes.session_token as string;
}


export default handler;
