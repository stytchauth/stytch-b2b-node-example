import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import Link from "next/link";
import Image from "next/image";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <header>
          <Link className="header" href="/">
            <Image alt="sdf" src="/logo.svg" width={190} height={200} />
          </Link>
          <div className="link-container">
            <Link
              className="header"
              target="_blank"
              href="https://www.stytch.com/docs"
            >
              Stytch Docs
            </Link>
            <Link
              className="header"
              target="_blank"
              href="https://github.com/stytchauth/stytch-nextjs-example"
            >
              <Image
                alt="Github"
                src="/github.svg"
                width={20}
                height={20}
                style={{ marginRight: "4px" }}
              />
              View on Github
            </Link>
          </div>
        </header>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
