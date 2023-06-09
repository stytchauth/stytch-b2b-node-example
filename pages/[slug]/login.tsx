import Link from "next/link";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import TenantedLoginForm from "@/components/TenantedLoginForm";
import { findBySlug } from "@/lib/orgService";
import { Organization } from "@/lib/loadStytch";
import {getDomainFromRequest} from "@/lib/urlUtils";

type Props = { org: null | Organization; domain: string; };

const TenantedLogin = ({ org, domain }: Props) => {
  const router = useRouter();
  const slug = router.query["slug"];
  if (org == null) {
    return (
      <div className="card">
        <div style={{ padding: "24px 40px" }}>
          <h2>Organization not found</h2>
          <p>
            No organization with the domain <strong>{slug}</strong> was found.
          </p>
          <Link href={"/login"}>Try again</Link>
        </div>
      </div>
    );
  }
  return <TenantedLoginForm org={org} domain={domain}/>;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { slug: string; }
> = async (context) => {
  const slug = context.params!["slug"];
  return {
    props: {
      org: await findBySlug(slug),
      domain: getDomainFromRequest(context.req),
    },
  };
};

export default TenantedLogin;
