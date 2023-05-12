import "@/styles/stytch.css";
import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Stytch Next.js B2B Example</title>
        <meta
          name="description"
          content="An example Next.js B2B application using Stytch for authentication"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main>
        <div className="container">
          <Component {...pageProps} />
        </div>
      </main>
    </>
  );
}
export default MyApp;
