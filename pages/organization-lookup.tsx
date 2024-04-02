import CodeSpan from "@/components/CodeSpan";
import OrganizationLookupForm from "@/components/OrganizationLookupForm";
import Link from "next/link";

export default function OrganizationLookup() {
  return (
    <>
      <div style={styles.container}>
        <div style={styles.details} className="bordered">
          <h2>Organization login flow</h2>
          <p>
            You can use the form on the right to look up the login URL for the
            Organization that you&apos;d like to log into. If you already know your
            Organization&apos;s login URL, you can also navigate directly to it.
          </p>
          <p>
            We refer to this type of login flow as the &quot;Organization&quot; flow,
            since the user is logging into one specific Organization that they
            identify at the beginning of the flow (generally, by nagivating
            directly to that Organization&apos;s unique login URL – for
            example,&nbsp;
            <CodeSpan>https://yourdomain.com/organization-slug/login</CodeSpan>
            ).
          </p>
          <p>
            In contrast, the &quot;Discovery&quot; flow is used when the user does not
            immediately identify which Organization they&apos;d like to log into. The
            Discovery flow is usually hosted on a generic login URL (for
            example,&nbsp;
            <CodeSpan>https://yourdomain.com/login</CodeSpan>).
          </p>
          <p>
            If you don&apos;t know your Organization&apos;s slug, or don&apos;t yet belong to
            any Organizations, check out&nbsp;
            <Link href="/discovery">the Discovery login flow</Link>
            &nbsp;instead.
          </p>
          {/* <CodeBlock codeString={recipe.code} />   */}
          <Link href="/">Back</Link>
        </div>
        <div style={styles.component} className="bordered">
          <OrganizationLookupForm />
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    margin: "48px 24px",
    flexWrap: "wrap-reverse",
    justifyContent: "center",
    alignItems: "top",
    gap: "48px",
  },
  details: {
    backgroundColor: "#FFF",
    padding: "48px",
    flexBasis: "600px",
    flexGrow: 1,
    maxWidth: "1000px",
  },
  component: {
    padding: "48px",
    maxWidth: "500px",
  },
};
