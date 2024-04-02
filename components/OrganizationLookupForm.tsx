import { FormEventHandler, useState } from "react";
import { useRouter } from "next/router";

const OrganizationLookupForm = () => {
  const [slug, setSlug] = useState<string>("");
  const router = useRouter();

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    router.push(`${slug}/login`);
  };

  return (
    <div>
      <h2>Find your login URL</h2>
      <p>Provide your Organization&apos;s slug below to find your login URL.</p>
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
      </form>
    </div>
  );
};

export default OrganizationLookupForm;
