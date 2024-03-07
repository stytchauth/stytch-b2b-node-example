import Link from "next/link";
import { FormEventHandler, useEffect, useState } from "react";

const STATUS = {
  INIT: 0,
  SENT: 1,
  ERROR: 2,
};

const isValidEmail = (emailValue: string) => {
  // Overly simple email address regex
  const regex = /\S+@\S+\.\S+/;
  return regex.test(emailValue);
};

type EmailLoginProps = React.PropsWithChildren<{
  title: string;
  onSubmit: (email: string) => Promise<{ status: number }>;
}>;
export const EmailLoginForm = ({
  title,
  onSubmit,
  children,
}: EmailLoginProps) => {
  const [emlSent, setEMLSent] = useState(STATUS.INIT);
  const [email, setEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(!isValidEmail(email));
  }, [email]);

  const onSubmitFormHandler: FormEventHandler = async (e) => {
    e.preventDefault();
    // Disable button right away to prevent sending emails twice
    if (isDisabled) {
      return;
    } else {
      setIsDisabled(true);
    }

    if (isValidEmail(email)) {
      const resp = await onSubmit(email);
      if (resp.status === 200) {
        setEMLSent(STATUS.SENT);
      } else {
        setEMLSent(STATUS.ERROR);
      }
    }
  };

  const handleTryAgain = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setEMLSent(STATUS.INIT);
  };

  return (
    <>
      <h1>{title}</h1>
      {children}
      {emlSent === STATUS.INIT && (
        <div className="section">
          <form onSubmit={onSubmitFormHandler}>
            <input
              name="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <button
              className="primary full-width no-margins"
              disabled={isDisabled}
              id="button"
              type="submit"
            >
              Send Magic Link
            </button>
          </form>
        </div>
      )}
      {emlSent === STATUS.SENT && (
        <div className="section center-items">
          <h2 className="gray">Check your email</h2>
          <p className="gray">{`An email was sent to ${email}`}</p>
          <Link href="" onClick={handleTryAgain}>
            Click here to try again
          </Link>
        </div>
      )}
      {emlSent === STATUS.ERROR && (
        <div className="section center-items">
          <h2 className="gray">Something went wrong!</h2>
          <p className="gray">{`Failed to send email to ${email}`}</p>
          <Link href="" onClick={handleTryAgain}>
            Click here to try again
          </Link>
        </div>
      )}
    </>
  );
};
