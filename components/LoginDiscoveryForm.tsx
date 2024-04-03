import { EmailLoginForm } from "./EmailLoginForm";
import { discoveryStart } from "@/lib/api";
import { OAuthButton, OAuthProviders } from "@/components/OAuthButton";
import { GetServerSideProps } from "next";
import { getDomainFromRequest } from "@/lib/urlUtils";

type Props = { domain: string };

export default function LoginDiscoveryForm({ domain }: Props) {
  return (
    <>
      <EmailLoginForm title="Log in or sign up" onSubmit={discoveryStart}>
        <p>Enter your email address below to receive a login email.</p>
      </EmailLoginForm>
      <h3 style={styles.h3}>or</h3>
      <OAuthButton providerType={OAuthProviders.Google} hostDomain={domain} />
      <OAuthButton
        providerType={OAuthProviders.Microsoft}
        hostDomain={domain}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  return {
    props: {
      domain: getDomainFromRequest(context.req),
    },
  };
};

const styles: Record<string, React.CSSProperties> = {
  h3: {
    display: "flex",
    justifyContent: "center",
  },
};
