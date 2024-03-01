import {SMSSendForm} from "@/components/SMSSendForm";
import {useRouter} from "next/router";
import {SMSAuthenticateForm} from "@/components/SMSAuthenticateForm";

const App = () => {
  const router = useRouter();
  const orgID = router.query.org_id as string;
  const memberID = router.query.member_id as string;
  const sent = router.query.sent as string;

  const Component = sent === "true" ? SMSAuthenticateForm : SMSSendForm;
  return (
    <div className="card">
      <h1>Complete MFA</h1>
      <Component
        orgID={orgID}
        memberID={memberID}
      />
    </div>
  )
};

export default App;
