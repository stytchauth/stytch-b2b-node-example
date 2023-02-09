// This API route sends a magic link to the specified email address.
import type {NextApiRequest, NextApiResponse} from 'next';
import {SSOService} from "../../../lib/ssoService";
import {Member} from "../../../lib/StytchB2BClient/base";
import {withSession} from "../../../lib/sessionService";

async function handler(member: Member, req: NextApiRequest, res: NextApiResponse) {
  try {
    const {display_name} = JSON.parse(req.body);
    const {connection} = await SSOService.create(display_name, member.organization_id);
    console.log('Successfully created new SSO connection', connection.connection_id)
    return res.status(200).json(connection);
  } catch (e) {
    console.error('Failed to create SSO connection', e)
    return res.status(400).end();
  }
}

export default withSession(handler);
