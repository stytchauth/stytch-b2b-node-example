import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "@/lib/loadStytch";

const stytchClient = loadStytch();

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orgID, memberID, phone_number } = req.body;

  const sendSMSMFAOTP = () => {
    return stytchClient.otps.sms.send({
      organization_id: orgID,
      member_id: memberID,
      phone_number: phone_number,
    });
  };

  try {
    const resp = await sendSMSMFAOTP();
    return res.redirect(307, `/smsmfa?sent=true&org_id=${resp.organization.organization_id}&member_id=${resp.member.member_id}`);
  } catch (error) {
    console.error("Could not authenticate in callback", error);

    return res.redirect(307, "/discovery");
  }
}

export default handler;
