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
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap"
            rel="stylesheet"
          />
        </Head>
        <header>
          <Link className="header" href="/">
            <Image alt="sdf" src="/logo.svg" width={190} height={200} />
          </Link>
          <div className="link-container">
            <Link
              className="header"
              target="_blank"
              href="https://www.stytch.com/docs/b2b"
            >
              Stytch Docs
            </Link>
            <Link
              className="header"
              target="_blank"
              href="https://github.com/stytchauth/stytch-b2b-node-example"
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
