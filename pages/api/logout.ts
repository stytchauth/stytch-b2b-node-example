// This API route logs a user out.
import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { revokeSession } from '../../lib/sessionService';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  revokeSession(req, res);
  return res.redirect(307, '/login');
}

export default handler;
