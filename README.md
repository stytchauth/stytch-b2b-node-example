# Stytch B2B authentication example in Next.js

<p align="center">
  <img src="https://user-images.githubusercontent.com/100632220/220425771-fa0a92ed-3088-4ef4-8bdd-7f771bbb16bc.png" width="750">
</p>

## Overview

This example application demonstrates how one may use Stytch's B2B authentication suite within a Next.js application. The application features a sign-up and login flow powered by Email magic links. On sign-up a new organization is created, and the initial member becomes the admin of that organization. As admin, the member is able to invite others to join the organization, and set up SSO connections via SAML or OIDC.

This project utilizes Stytch's [Node Backend SDK](https://www.npmjs.com/package/stytch) to power authentication. All authentication logic lives on the backend of this Next.js application in API routes. The API routes allow for communication between the frontend, and Stytch.

This project was bootstrapped with [Create Next App](https://nextjs.org/docs/api-reference/create-next-app).

## Set up

Follow the steps below to get this application fully functional and running using your own Stytch credentials.

### In the Stytch Dashboard

1. Create a [Stytch](https://stytch.com/) account. Within the sign up flow select **B2B Authentication** as the authentication type you are interested in. Once your account is set up a Project called "My first project" will be automatically created for you.

   - If you signed up for Stytch in the past then your default Project is likely a Consumer type Project. You can confirm this in your [Project settings](https://stytch.com/dashboard/project-settings). To create a B2B project, use the Project dropdown near the top of the dashboard side nav. Be sure to select **B2B Authentication** as the authentication type.

2. Navigate to [Redirect URLs](https://stytch.com/dashboard/redirect-urls), and add `http://localhost:3000/api/callback` as the types **Login**, **Sign-up**, **Discovery** and **Invite**.

   <img width="400" alt="Redirect URLs" src="https://user-images.githubusercontent.com/100632220/220420098-84c78ca3-4e71-46b5-90f1-25afbb571ce2.png">

3. Finally, navigate to [API Keys](https://stytch.com/dashboard/api-keys). You will need the `project_id`, `secret`, and `public_token` values found on this page later on.

### On your machine

In your terminal clone the project and install dependencies:

```bash
git clone https://github.com/stytchauth/stytch-b2b-nextjs-example.git
cd stytch-b2b-nextjs-example
npm i
```

Next, create `.env.local` file by running the command below which copies the contents of `.env.template`.

```bash
cp .env.template .env.local
```

Open `.env.local` in the text editor of your choice, and set the environment variables using the `project_id`, `secret`, and `public_token` found on [API Keys](https://stytch.com/dashboard/api-keys). Leave the `NEXT_PUBLIC_STYTCH_PROJECT_ENV` value as `test`.

```
# This is what a completed .env.local file will look like
NEXT_PUBLIC_STYTCH_PROJECT_ENV=test
STYTCH_PROJECT_ID=project-test-00000000-0000-1234-abcd-abcdef1234
STYTCH_SECRET=secret-test-12345678901234567890abcdabcd
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN=public-token-test-abc123-abcde-1234-0987-0000-abcd1234
```

## Running locally

After completing all the setup steps above the application can be run with the command:

```bash
npm run dev
```

The application will be available at [`http://localhost:3000`](http://localhost:3000).

## Get help and join the community

#### :speech_balloon: Stytch community Slack

Join the discussion, ask questions, and suggest new features in our [Slack community](https://join.slack.com/t/stytch/shared_invite/zt-nil4wo92-jApJ9Cl32cJbEd9esKkvyg)!

#### :question: Need support?

Check out the [Stytch Forum](https://forum.stytch.com/) or email us at [support@stytch.com](mailto:support@stytch.com).
