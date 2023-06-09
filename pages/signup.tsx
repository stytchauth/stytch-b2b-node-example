import SignupForm from "@/components/SignupForm";
import {GetServerSideProps} from "next";
import {getDomainFromRequest} from "@/lib/urlUtils";

type Props = { domain: string; };

export default function Signup({ domain }: Props) {
  return <SignupForm domain={domain} />;
}

export const getServerSideProps: GetServerSideProps<
    Props,
    { slug: string; }
> = async (context) => {
  return {
    props: {
      domain: getDomainFromRequest(context.req),
    },
  };
};