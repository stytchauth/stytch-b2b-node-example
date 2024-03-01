type SMSProps = React.PropsWithChildren<{
  memberID: string,
  orgID: string,
}>;
export const SMSAuthenticateForm = ({ memberID, orgID }: SMSProps) => {
  return (
    <div>
      <p>Please enter the one-time login code sent to your phone.</p>
      <form method="POST" action="/api/smsmfa/authenticate" className="row">
        <input
          type={"text"}
          placeholder={"123456"}
          name="code"
        />
        <input type="hidden" name="orgID" value={orgID} />
        <input type="hidden" name="memberID" value={memberID} />
        <button type="submit" className="primary">
          Submit
        </button>
      </form>
    </div>
  );
};
