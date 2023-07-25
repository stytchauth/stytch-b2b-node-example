import {SMSSendForm} from "@/components/SMSSendForm";
import {useRouter} from "next/router";
import {SMSAuthenticateForm} from "@/components/SMSAuthenticateForm";

const App = () => {
  const router = useRouter();
  const orgID = router.query.org_id as string;
  const memberID = router.query.member_id as string;
  const sent = router.query.sent as string;

  if(sent === "true") {
    return (
      <div className="card">
        <SMSAuthenticateForm
          orgID={orgID}
          memberID={memberID}
        />
      </div>
    );
  }

  return (
    <div className="card">
      <SMSSendForm
        orgID={orgID}
        memberID={memberID}
      />
    </div>
  );
};

export default App;
