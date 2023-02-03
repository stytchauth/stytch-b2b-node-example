import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import Head from 'next/head';
import NavBar from '../components/NavBar';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <title>Stytch B2B Demo</title>
      </Head>

        <NavBar />
        <Component {...pageProps} />
    </>
  );
}
export default MyApp;
