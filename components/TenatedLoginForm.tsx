import React, { FormEventHandler, useEffect, useState} from 'react';
import {Organization} from "../lib/StytchB2BClient/organizations";
import {login} from "../lib/api";

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

type Props = {
  org: Organization
}
const TenantedLoginForm = ({org}: Props) => {
  const [emlSent, setEMLSent] = useState(STATUS.INIT);
  const [email, setEmail] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(!isValidEmail(email))
  }, [email])

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    // Disable button right away to prevent sending emails twice
    if (isDisabled) {
      return;
    } else {
      setIsDisabled(true);
    }

    if (isValidEmail(email)) {
      const resp = await login(email, org.organization_id);
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
    <div style={styles.container}>
      {emlSent === STATUS.INIT && (
        <div>
          <h2>Log in to {org.organization_name}</h2>
          <form onSubmit={onSubmit}>
            <input
              style={styles.emailInput}
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <button className="full-width" disabled={isDisabled} id="button" type="submit">
              Continue
            </button>
            {org.sso_default_connection_id && (
              <span>
                Or, use this organization&apos;s&nbsp;
                <a href={`https://api.max.dev.stytch.com/v1/public/sso/start?connection_id=${org.sso_default_connection_id}&public_token=${"public-token-live-cf43b964-c802-4f0d-aafe-7e64d88d692f"}`}>
                Preferred Identity Provider
              </a>
              </span>
            )}
          </form>
        </div>
      )}
      {emlSent === STATUS.SENT && (
        <div>
          <h2>Check your email</h2>
          <p>{`An email was sent to ${email}`}</p>
          <a className="link" onClick={handleTryAgain}>
            Click here to try again.
          </a>
        </div>
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

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    margin: '48px 24px',
    flexWrap: 'wrap-reverse',
    justifyContent: 'center',
    gap: '48px',
  },
  emailInput: {
    width: '100%',
    fontSize: '18px',
    marginBottom: '8px',
  },
};

export default TenantedLoginForm;
