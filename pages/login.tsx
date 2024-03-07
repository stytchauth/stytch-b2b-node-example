import LoginDiscoveryForm from "@/components/LoginDiscoveryForm";
import { GetServerSideProps } from "next";
import { getDomainFromRequest } from "@/lib/urlUtils";

type Props = { domain: string };

export default function Login({ domain }: Props) {
  return (
    <div className="card">
      <LoginDiscoveryForm domain={domain} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<
  Props,
  { slug: string }
> = async (context) => {
  return {
    props: {
      domain: getDomainFromRequest(context.req),
    },
  };
};
