import { SMSSendForm } from "@/components/SMSSendForm";
import { useRouter } from "next/router";
import { SMSAuthenticateForm } from "@/components/SMSAuthenticateForm";
import Link from "next/link";
import CodeBlock from "@/components/common/CodeBlock";

const App = () => {
  const router = useRouter();
  const orgID = router.query.org_id as string;
  const memberID = router.query.member_id as string;
  const sent = router.query.sent as string;

  const MFAComponent = sent === "true" ? SMSAuthenticateForm : SMSSendForm;

  return (
    <>
      <div style={styles.container}>
        <div style={styles.details} className="bordered">
          <h2>SMS One-Time Password MFA</h2>
          <p>
            MFA settings can be configured at the Organization level. When
            required, users will need to complete MFA before you can retrieve a
            Stytch Session for the Organization that they&apos;re logging into.
          </p>
          <p>
            We currently support&nbsp;
            <Link
              href="https://stytch.com/docs/b2b/api/otp-sms-send"
              target="_blank"
            >
              SMS OTP
            </Link>
            &nbsp;and&nbsp;
            <Link
              href="https://stytch.com/docs/b2b/api/totp-create"
              target="_blank"
            >
              TOTP
            </Link>
            &nbsp;as MFA options.
          </p>
          <p>Below is a code snippet that powers the component to the right.</p>
          <CodeBlock
            codeString={`// When a user submits their phone number during the MFA setup flow,
// we call the following backend Stytch Node SDK method

stytchClient.otps.sms.send({
  organization_id: orgID,
  member_id: memberID,
  mfa_phone_number: phone_number,
});

// When a user submits the OTP code that they receive, we call
// the following backend Stytch Node SDK method

stytchClient.otps.sms.authenticate({
  organization_id: orgID,
  member_id: memberID,
  code: code,
  intermediate_session_token: discoverySessionData.intermediateSession,
});
`}
          />
          <Link href="/organization-lookup">Back</Link>
        </div>
        <div style={styles.component} className="bordered">
          <h2>Complete MFA</h2>
          <MFAComponent orgID={orgID} memberID={memberID} />
        </div>
      </div>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    margin: "48px 24px",
    flexWrap: "wrap-reverse",
    justifyContent: "center",
    alignItems: "top",
    gap: "48px",
  },
  details: {
    backgroundColor: "#FFF",
    padding: "48px",
    flexBasis: "600px",
    flexGrow: 1,
    maxWidth: "1000px",
  },
  component: {
    padding: "48px",
    maxWidth: "500px",
  },
  h3: {
    display: "flex",
    justifyContent: "center",
  },
};

export default App;
