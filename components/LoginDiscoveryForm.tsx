import React, {FormEventHandler, useRef, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {EmailLoginForm} from "./EmailLoginForm";
import {discoveryStart} from "../lib/api";


const ContinueToTenantForm = ({onBack}: { onBack: () => void }) => {
  const [slug, setSlug] = useState<string>("");
  const router = useRouter();

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    router.push(`${slug}/login`);
  };

  return (
    <div>
      <h1>What is your Organization&apos;s Domain?</h1>
      <p>
        Don&apos;t know your organization&apos;s Domain?
        Find your <Link href="" onClick={onBack}>organizations</Link>.
      </p>
      <form onSubmit={onSubmit}>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="acme-corp"
        />
        <button className="primary" id="button" type="submit" disabled={!slug}>
          Continue
        </button>
      </form>
    </div>
  )
}

const LoginDiscoveryForm = () => {
  const [isDiscovery, setIsDiscovery] = useState(true)

  if (isDiscovery) {
    return (
      <EmailLoginForm
        title="Sign in"
        onSubmit={discoveryStart}
      >
        <p>
          We&apos;ll email you a magic code for a password-free sign in.
          <br/>
          You&apos;ll be able to choose which organization you want to access.
          <br/>
          Or you can <Link href="" onClick={() => setIsDiscovery(false)}>sign in manually instead</Link>.
        </p>
      </EmailLoginForm>
    )
  } else {
    return (
      <ContinueToTenantForm
        onBack={() => setIsDiscovery(true)}
      />
    )
  }
};

export default LoginDiscoveryForm;
