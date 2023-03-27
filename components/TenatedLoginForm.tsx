import React, { FormEventHandler, useEffect, useState } from 'react';
import { login } from '../lib/api';
import { formatSSOStartURL, Organization } from '../lib/loadStytch';

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
  org: Organization;
};
const TenantedLoginForm = ({ org }: Props) => {
  const [emlSent, setEMLSent] = useState(STATUS.INIT);
  const [email, setEmail] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(!isValidEmail(email));
  }, [email]);

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
    <div className="card">
      <h1>Log in to {org.organization_name}</h1>
      {emlSent === STATUS.INIT && (
        <div className="section">
          <form onSubmit={onSubmit}>
            <input
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <button className="primary" disabled={isDisabled} id="button" type="submit">
              Continue
            </button>
            {org.sso_default_connection_id && (
              <span>
                Or, use this organization&apos;s&nbsp;
                <a href={formatSSOStartURL(org.sso_default_connection_id)}>Preferred Identity Provider</a>
              </span>
            )}
          </form>
        </div>
      )}
      {emlSent === STATUS.SENT && (
        <div className="section">
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

export default TenantedLoginForm;
