type SMSProps = React.PropsWithChildren<{
  memberID: string,
  orgID: string,
}>;
export const SMSSendForm = ({ memberID, orgID }: SMSProps) => {
  return (
    <div>
      <p>Enter your phone number below. You'll receive an SMS with a one-time login code.</p>
      <form method="POST" action="/api/smsmfa/send" className="row">
        <input
          type={"text"}
          placeholder={`+18005551234`}
          name="phone_number"
        />
        <input type="hidden" name="orgID" value={orgID} />
        <input type="hidden" name="memberID" value={memberID} />
        <button type="submit" className="primary">
          Send
        </button>
      </form>
    </div>
  );
};
