import Link from "next/link";

const App = () => {
  return (
    <div className="card">
      <h1>Stytch B2B example app</h1>
      <p>
        This demo app shows how to build a B2B authentication experience with
        Stytch.
      </p>
      <Link href={"/login"}>Log in</Link>
      <br />
      <Link href={"/signup"}>Sign Up</Link>
    </div>
  );
};

export default App;
