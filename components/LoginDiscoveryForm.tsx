import React, {FormEventHandler, useRef} from "react";
import {useRouter} from "next/router";


// TODO - Make this integrate with the discovery endpoints
// For now - just link to tenanted login
const LoginDiscoveryForm = () => {
  const slug = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    router.push(`${slug.current?.value}/login`)
  };


  return (
    <div style={styles.container}>
      <div>
        <h2>What is your Organization&apos;s Domain Name?</h2>
        <p>
          If you don&apos;t know, please reach out to your organization administrator.
        </p>
        <form onSubmit={onSubmit}>
          <input
            ref={slug}
            style={styles.emailInput}
            placeholder="acme-corp"
          />
          <button className="full-width" id="button" type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}


const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    margin: '48px 24px',
    flexWrap: 'wrap-reverse',
    justifyContent: 'center',
    gap: '48px',
  },
  emailInput: {
    width: '100%',
    fontSize: '18px',
    marginBottom: '8px',
  },
};


export default LoginDiscoveryForm