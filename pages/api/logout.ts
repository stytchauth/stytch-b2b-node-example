// This API route logs a user out.
import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);
  // Delete the session cookie by setting maxAge to 0
  cookies.set('session', '', { maxAge: 0 });

  return res.redirect(307, '/login')
}

export default handler;
