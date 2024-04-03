import LoginFlowCard from "@/components/LoginFlowCard";
import { Recipes } from "@/lib/recipeData";
import Link from "next/link";
import { redirect } from "next/navigation";

const App = () => {
  return (
    <div>
      <div style={styles.intro}>
        <h1>Stytch B2B example app</h1>
        <p>
          This app demonstrates how to build a B2B authentication experience
          with Stytch. This app is an example of a backend Stytch integration
          that uses&nbsp;
          <Link
            href={"https://github.com/stytchauth/stytch-node"}
            target="_blank"
          >
            our Node SDK
          </Link>
          &nbsp;to communicate with the Stytch API. The frontend is fully
          custom, and does not use Stytch&apos;s frontend JavaScript SDK. If
          you&apos;re interested in a B2B example application that does use our
          frontend JavaScript SDK, we&apos;d recommend checking out our&nbsp;
          <Link
            href={"https://github.com/stytchauth/stytch-b2b-sdk-example"}
            target="_blank"
          >
            NextJS example app
          </Link>
          &nbsp;instead.
        </p>
      </div>
      <div style={styles.loginRow}>
        {Object.values(Recipes).map((recipe) => (
          <LoginFlowCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  loginRow: {
    display: "flex",
    marginTop: "24px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  intro: {
    maxWidth: "1420px",
    margin: "auto",
  },
};

export default App;
