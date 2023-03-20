import React, {FormEventHandler, useEffect, useState} from "react";
import {login} from "../lib/api";
import {formatSSOStartURL, Organization, publicToken} from "../lib/loadStytch";
import {EmailLoginForm} from "./EmailLoginForm";

type Props = {
  org: Organization;
};
const TenantedLoginForm = ({org}: Props) => {

  return (
    <div className="card">
      <EmailLoginForm
        title={`Log in to ${org.organization_name}`}
        onSubmit={(email) => login(email, org.organization_id)}
      />
    </div>
  );
};

export default TenantedLoginForm;
