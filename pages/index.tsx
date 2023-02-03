import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";

const App = () => {
  return (
    <div style={{ padding: '24px 40px' }}>
      <h2>Stytch B2B Demo App</h2>
      <p>
        This demo app shows how to build a B2B authentication experience with Stytch.
      </p>
      <Link href={"/login"}>Log in</Link>
      <br />
      <Link href={"/signup"}>Sign Up</Link>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  loginRow: {
    display: 'flex',
    marginTop: '24px',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
};

export default App;
