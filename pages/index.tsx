import Link from "next/link";
import { redirect } from "next/navigation";

const App = () => {
  return (
    <div className="card">
      <h1>Stytch B2B example app</h1>
      <p>
        This app demonstrates how to build a B2B authentication experience with
        Stytch.
      </p>
      <p>
        This app is an example of a backend Stytch integration that uses&nbsp;
        <Link href={"https://github.com/stytchauth/stytch-node"}>
          our Node SDK
        </Link>
        &nbsp;to communicate with the Stytch API. The frontend is fully custom,
        and does not use Stytch's frontend JavaScript SDK.
      </p>
      <p>
        If you're interested in a B2B example application that does use our
        frontend JavaScript SDK, we'd recommend checking out our&nbsp;
        <Link href={"https://github.com/stytchauth/stytch-b2b-sdk-example"}>
          NextJS example app
        </Link>
        &nbsp;instead.
      </p>
      <Link href={"/login"}>
        <button className={"primary full-width"}>{"Log in or sign up"}</button>
      </Link>
    </div>
  );
};

export default App;
