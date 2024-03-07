import { deleteMember, invite } from "@/lib/api";
import { useRouter } from "next/router";
import {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { Member, Organization } from "@/lib/loadStytch";

type Props = {
  organization: Organization;
  currentUser: Member;
  member: Member;
  members: Member[];
};

const isValidEmail = (emailValue: string) => {
  // Overly simple email address regex
  const regex = /\S+@\S+\.\S+/;
  return regex.test(emailValue);
};

const isAdmin = (member: Member) => !!member.trusted_metadata.admin;

const MemberRow = ({
  member,
  currentUser,
}: Pick<Props, "member" | "currentUser">) => {
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);
  const doDelete: MouseEventHandler = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    await deleteMember(member.member_id);
    // Force a reload to refresh the user list
    router.replace(router.asPath);
    // TODO: Success toast?
  };

  const canDelete =
    /* Do not let members delete themselves! */
    member.member_id !== currentUser.member_id &&
    /* Only admins can delete! */
    isAdmin(currentUser);

  const deleteButton = (isDisabled: boolean) => (
    <button className="primary small" disabled={isDisabled} onClick={doDelete}>
      Delete
    </button>
  );

  return (
    <li>
      {/* Do not let members delete themselves! */}
      {canDelete ? deleteButton(false) : deleteButton(true)}
      &nbsp;[{isAdmin(member) ? "admin" : "member"}]&nbsp;
      <span className="code">{member.email_address}</span> ({member.status}
      )&nbsp;
    </li>
  );
};

const MemberList = ({
  members,
  currentUser,
  organization,
}: Pick<Props, "members" | "currentUser" | "organization">) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(!isValidEmail(email));
  }, [email]);

  const onInviteSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    // Disable button right away to prevent sending emails twice
    if (isDisabled) {
      return;
    } else {
      setIsDisabled(true);
    }
    await invite(email);
    // Force a reload to refresh the user list
    router.replace(router.asPath);
    setEmail("");
  };

  return (
    <>
      <div className="section">
        <ul>
          {members.map((member) => (
            <MemberRow
              key={member.member_id}
              member={member}
              currentUser={currentUser}
            />
          ))}
        </ul>
      </div>

      <div className="section">
        <h2>Invite new member</h2>
        <form onSubmit={onInviteSubmit} className="row">
          <input
            placeholder={`your-coworker@${
              organization.email_allowed_domains[0] ?? "example.com"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <button
            className="primary"
            style={{ width: 200 }}
            disabled={isDisabled}
            type="submit"
          >
            Invite
          </button>
        </form>
      </div>
    </>
  );
};

const MembersCard = ({
  organization,
  members,
  currentUser,
}: Pick<Props, "organization" | "members" | "currentUser">) => {
  return (
    <div className="card profile-card">
      <h1>Members</h1>
      <p>
        You're currently logged in as&nbsp;
        <span className="code">{currentUser.email_address}</span>. Below, you'll
        find a full list of Members who belong to&nbsp;
        {organization.organization_name}:
      </p>
      <MemberList
        organization={organization}
        members={members}
        currentUser={currentUser}
      />
    </div>
  );
};

export default MembersCard;
