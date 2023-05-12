import { FormEventHandler, useEffect, useState } from "react";
import { login } from "../lib/api";
import {
  formatSSOStartURL,
  Organization,
  publicToken,
} from "../lib/loadStytch";
import { EmailLoginForm } from "./EmailLoginForm";

type Props = {
  org: Organization;
};
const TenantedLoginForm = ({ org }: Props) => {
  return (
    <div className="card">
      <EmailLoginForm
        title={`Log in to ${org.organization_name}`}
        onSubmit={(email) => login(email, org.organization_id)}
      >
        {org.sso_default_connection_id && (
          <div>
            <h2>
              Or, use this organization&apos;s&nbsp;
              <a href={formatSSOStartURL(org.sso_default_connection_id)}>
                Preferred Identity Provider
              </a>
            </h2>
            <br />
          </div>
        )}
      </EmailLoginForm>
    </div>
  );
};

export default TenantedLoginForm;
