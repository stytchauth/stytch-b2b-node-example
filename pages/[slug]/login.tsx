import React from "react";
import Link from "next/link";
import loadStytch from "../../lib/loadStytch";
import { GetServerSideProps } from "next";
import { SearchOperator } from "../../lib/StytchB2BClient/base";
import { Organization } from "../../lib/StytchB2BClient/organizations";
import { useRouter } from "next/router";
import TenantedLoginForm from "../../components/TenatedLoginForm";
import { OrgService } from "../../lib/orgService";

type Props = { org: null | Organization };

const TenantedLogin = ({ org }: Props) => {
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
  return <TenantedLoginForm org={org} />;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { slug: string }
> = async (context) => {
  const slug = context.params!["slug"];
  return {
    props: {
      org: await OrgService.findBySlug(slug),
    },
  };
};

export default TenantedLogin;
