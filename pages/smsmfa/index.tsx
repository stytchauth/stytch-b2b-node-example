import {SMSForm} from "@/components/SMSForm";
import {useRouter} from "next/router";

const App = () => {
  const router = useRouter();
  const orgID = router.query.org_id as string;
  const memberID = router.query.member_id as string;
  const sent = router.query.sent as string;

  return (
    <div className="card">
      <SMSForm
        orgID={orgID}
        memberID={memberID}
        sent={sent === "true"}
      />
    </div>
  );
};

export default App;
