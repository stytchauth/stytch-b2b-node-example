import React, {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { signup } from "../lib/api";

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

const isValidOrgName = (organizationName: string) => {
  return organizationName.length > 3;
};

const SignupForm = () => {
  const [emlSent, setEMLSent] = useState(STATUS.INIT);
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const allValid = isValidEmail(email) && isValidOrgName(organizationName);
    setIsDisabled(!allValid);
  }, [email, organizationName]);

  const onEmailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value);
    if (isValidEmail(e.target.value)) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    // Disable button right away to prevent sending emails twice
    if (isDisabled) {
      return;
    } else {
      setIsDisabled(true);
    }

    if (isValidEmail(email)) {
      const resp = await signup(email, organizationName);
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
    // setEmail('');
    // setOrganizationName('');
  };

  return (
    <div className="card">
      {emlSent === STATUS.INIT && (
        <>
          <h1>Sign up</h1>
          <p>
            Make sure to add the appropriate Redirect URL in your{" "}
            <a
              className="link"
              href="https://stytch.com/dashboard/redirect-urls"
              target="_blank"
              rel="noreferrer"
            >
              Stytch Dashboard
            </a>
          </p>
          <form onSubmit={onSubmit}>
            <input
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <input
              placeholder="Foo Corp"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
            <button
              className="primary"
              disabled={isDisabled}
              id="button"
              type="submit"
            >
              Continue
            </button>
          </form>
        </>
      )}
      {emlSent === STATUS.SENT && (
        <>
          <h1>Check your email</h1>
          <p>{`An email was sent to ${email}`}</p>
          <a className="link" onClick={handleTryAgain}>
            Click here to try again.
          </a>
        </>
      )}
      {emlSent === STATUS.ERROR && (
        <div>
          <h2>Something went wrong!</h2>
          <p>{`Failed to send email to ${email}`}</p>
          <a className="link" onClick={handleTryAgain}>
            Click here to try again.
          </a>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
