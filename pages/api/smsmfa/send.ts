import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "@/lib/loadStytch";

const stytchClient = loadStytch();

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone_number } = req.body;

  const sendSMSMFAOTP = () => {
    return stytchClient.otps.sms.send({
      organization_id: process.env.ORG_ID || "",
      member_id: process.env.MEMBER_ID || "",
      phone_number: phone_number,
    });
  };

  try {
    await sendSMSMFAOTP();
    return res.redirect(307, `/smsmfa?sent=true`);
  } catch (error) {
    console.error("Could not authenticate in callback", error);

    return res.redirect(307, "/discovery");
  }
}

export default handler;
