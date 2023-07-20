import { useState } from "react";

const STATUS = {
  INIT: 0,
  SENT: 1,
  ERROR: 2,
};

type SMSProps = React.PropsWithChildren<{
  sent: boolean,
}>;
export const SMSForm = ({ sent }: SMSProps) => {
  const [state, setState] = useState(sent ? STATUS.SENT : STATUS.INIT);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");

  return (
    <>
      {state === STATUS.INIT && (
        <form method="POST" action="/api/smsmfa/send" className="row">
          <input
            type={"text"}
            placeholder={`Phone Number`}
            name="phone_number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button type="submit" className="primary" onChange={() => setState(STATUS.SENT)}>
            Send
          </button>
        </form>
      )}
      {state === STATUS.SENT && (
        <form method="POST" action="/api/smsmfa/authenticate" className="row">
          <input
            type={"text"}
            placeholder={`Code`}
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit" className="primary">
            Authenticate
          </button>
        </form>
      )}
    </>
  );
};
