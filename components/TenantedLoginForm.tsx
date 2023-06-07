import { useEffect, useState } from "react";
import { login } from "@/lib/api";
import {
    formatOAuthStartURL,
    formatSSOStartURL,
    Organization,
} from "@/lib/loadStytch";
import { EmailLoginForm } from "./EmailLoginForm";
import Link from "next/link";

type Props = {
  org: Organization;
};
const TenantedLoginForm = ({ org }: Props) => {
    const [googleOAuthURL, setGoogleOAuthURL] = useState("");
    useEffect(() => {
        // UseEffect since format requires window to be loaded
        setGoogleOAuthURL(formatOAuthStartURL("google", org.organization_slug));
    }, [org.organization_slug]);

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
        or 
        <Link href={googleOAuthURL}>
            Login with Google
        </Link>
    </div>
  );
};

export default TenantedLoginForm;
