import Link from "next/link";
import CodeBlock from "./common/CodeBlock";
import { Organization } from "@/lib/loadStytch";

type Props = {
  organization: Organization;
};

const OrganizationCard = ({ organization }: Pick<Props, "organization">) => {
  return (
    <div className="card profile-card">
      <div className="section">
        <h1>Welcome to your {organization.organization_name} profile!</h1>
        <p>
          For future reference, this Organization&apos;s slug is&nbsp;
          <span className="code">{organization.organization_slug}</span>. Below
          is the full Organization object:
        </p>
        <CodeBlock
          codeString={JSON.stringify(organization, null, 2).replace(" ", "")}
          maxHeight="450px"
        />
      </div>
      <div className="section">
        <Link href={"/orgswitcher"}>
          <button className="primary half-width">Switch Organizations</button>
        </Link>
        <Link href={"/api/logout"}>
          <button className="primary half-width" style={{ float: "right" }}>
            Log out
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OrganizationCard;
