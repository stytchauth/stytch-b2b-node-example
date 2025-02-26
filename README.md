# Stytch B2B backend Node example

<p align="center">
  <img width="787" alt="image" src="https://github.com/stytchauth/stytch-b2b-node-example/assets/113396792/1c374141-b72f-4706-aaf7-bd71247b7c39">
</p>

## Overview

This example application demonstrates how to use Stytch's B2B authentication suite using our [backend Node SDK](https://www.npmjs.com/package/stytch) inside of a Next.js application. The application features both Discovery and Organization B2B login flows, you can try out a hosted version of this app on Vercel at [https://www.stytchb2bdemo.app/](https://www.stytchb2bdemo.app/).

Using the Discovery flow, users can log in via Email Magic Links, Google OAuth, or Microsoft OAuth, and can join existing Organizations that they have access to or create new ones. Using the Organization flow, users can log into a specific Organization that they belong to via Email Magic Links, Google OAuth, Microsoft OAuth, or SSO.

On this example application's profile page, Organization admins are able to invite other Members to the Organization and can set up SSO connections via SAML or OIDC.

This project was bootstrapped with [Create Next App](https://nextjs.org/docs/api-reference/create-next-app).

## Setup

Follow the below steps below to run this application using your own Stytch API keys.

### In the Stytch Dashboard

1. Create a [Stytch](https://stytch.com/) account. During the signup flow, select **B2B Authentication**. Once your account is set up, a project called "My first project" will be created for you.

   - If you signed up for Stytch in the past, then your default project is likely a Consumer project. You can confirm this in your [Project settings](https://stytch.com/dashboard/project-settings). To create a B2B project, use the Project dropdown near the top of the dashboard side nav. Be sure to select **B2B Authentication** as the authentication type.

2. Navigate to [Redirect URLs](https://stytch.com/dashboard/redirect-urls), and add `http://localhost:3000/api/callback` as the types **Login**, **Sign-up**, **Discovery** and **Invite**.

   <img width="500" alt="UI to add an allowlisted Redirect URL" src="https://github.com/stytchauth/stytch-b2b-nextjs-example/assets/113396792/bb9f6616-8c06-44bd-846b-6ae91a5b5d69">

3. Finally, navigate to [API Keys](https://stytch.com/dashboard/api-keys). You will need the `project_id`, `secret`, and `public_token` values found on this page.

### On your machine

In your terminal, clone the project and install dependencies:

```bash
git clone https://github.com/stytchauth/stytch-b2b-node-example.git
cd stytch-b2b-node-example
pnpm install
```

Next, create an `.env.local` file by running the command below, which copies the contents of `.env.template`.

```bash
cp .env.template .env.local
```

Open `.env.local` in the text editor of your choice, and set the environment variables using the `project_id`, `secret`, and `public_token` found on the [API Keys](https://stytch.com/dashboard/api-keys) page. Leave the `NEXT_PUBLIC_STYTCH_PROJECT_ENV` value as `test`.

```
# This is what a completed .env.local file will look like
NEXT_PUBLIC_STYTCH_PROJECT_ENV=test
STYTCH_PROJECT_ID=project-test-00000000-0000-1234-abcd-abcdef1234
STYTCH_SECRET=secret-test-12345678901234567890abcdabcd
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN=public-token-test-abc123-abcde-1234-0987-0000-abcd1234
```

## Running locally

After completing all of the above steps, the application can be run with the command:

```bash
pnpm run dev
```

The application will be available at [`http://localhost:3000`](http://localhost:3000).

## Get help and join the community

#### :speech_balloon: Stytch community Slack

Join the discussion, ask questions, and suggest new features in our [Slack community](https://stytch.com/docs/b2b/resources/support/overview)!

#### :question: Need support?

Check out the [Stytch Forum](https://forum.stytch.com/) or email us at [support@stytch.com](mailto:support@stytch.com).
