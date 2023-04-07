import React, { FormEventHandler, useRef, useState } from "react";
import { useRouter } from "next/router";

// TODO - Make this integrate with the discovery endpoints
// For now - just link to tenanted login
const LoginDiscoveryForm = () => {
  const [slug, setSlug] = useState<string>("");
  // const slug = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    router.push(`${slug}/login`);
  };

  return (
    <div>
      <h1>What is your Organization&apos;s slug?</h1>
      <p>
        If you don&apos;t know, please reach out to your organization
        administrator.
      </p>
      <form onSubmit={onSubmit}>
        <input type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="acme-corp"
        />
        <button className="primary" id="button" type="submit" disabled={!slug}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default LoginDiscoveryForm;
