import { FormEventHandler, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { EmailLoginForm } from "./EmailLoginForm";
import { discoveryStart } from "@/lib/api";
import { OAuthButton, OAuthProviders } from "@/components/OAuthButton";

const ContinueToTenantForm = ({ onBack }: { onBack: () => void }) => {
  const [slug, setSlug] = useState<string>("");
  const router = useRouter();

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    router.push(`${slug}/login`);
  };

  return (
    <div>
      <h1>Log into a specific Organization</h1>
      <p>
        Provide the slug of the Organization that you&apos;d like to log into
        below, and you&apos;ll be redirected to the Organization&apos;s unique
        login URL. Note that you can also navigate directly to your
        Organization&apos;s unique login URL, if you know it.
      </p>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="acme-corp"
        />
        <button
          className="primary full-width"
          id="button"
          type="submit"
          disabled={!slug}
        >
          Continue
        </button>
        <p>
          Don&apos;t know your Organization&apos;s slug? Try the&nbsp;
          <Link href="" onClick={onBack}>
            Discovery login flow
          </Link>
          &nbsp;instead.
        </p>
      </form>
    </div>
  );
};

type Props = { domain: string };

const LoginDiscoveryForm = ({ domain }: Props) => {
  const [isDiscovery, setIsDiscovery] = useState(true);

  if (isDiscovery) {
    return (
      <>
        <EmailLoginForm title="Log in or sign up" onSubmit={discoveryStart}>
          <p>
            Once you complete one of the below authentication methods (Email
            Magic Links or OAuth), you&apos;ll be able to view which
            Organizations you have access to and choose which one you&apos;d
            like to log into. If you don&apos;t currently have access to any
            Organizations, you&apos;ll be able to create one.
          </p>
          <p>
            We refer to this as the Discovery flow, since the user authenticates
            in order to discover which Organizations they can access.
          </p>
          <p>
            For additional information about the two distinct types of B2B login
            flows, see our&nbsp;
            <Link
              href={
                "https://stytch.com/docs/b2b/guides/organizations/login-flows"
              }
            >
              Discovery vs. Organization login flows resource
            </Link>
            .
          </p>
        </EmailLoginForm>
        <h2 className="center">or</h2>
        <OAuthButton providerType={OAuthProviders.Google} hostDomain={domain} />
        <OAuthButton
          providerType={OAuthProviders.Microsoft}
          hostDomain={domain}
        />
        <br></br>
        <p>
          If you already know the slug of the Organization that you&apos;d like
          to log into,&nbsp;
          <Link href="" onClick={() => setIsDiscovery(false)}>
            click here
          </Link>
          &nbsp;to access the Organization-specific login flow instead.
        </p>
      </>
    );
  } else {
    return <ContinueToTenantForm onBack={() => setIsDiscovery(true)} />;
  }
};

export default LoginDiscoveryForm;
