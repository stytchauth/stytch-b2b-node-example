import {SMSForm} from "@/components/SMSForm";
import {useRouter} from "next/router";

const App = () => {
  const router = useRouter();
  const sent = !!router.query.sent;
  console.log(router.query)
  console.log(sent)

  return (
    <div className="card">
      <SMSForm sent={true} />
    </div>
  );
};

export default App;
