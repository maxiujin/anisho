# Ani-Sho

A Clerk-powered anime debate gauntlet. Users sign in, enter a queue, get randomly paired, and debate one of ten anime topics in a chat room.

## Local Development

```bash
npm install
npm run dev
```

Create `.env.local` with Clerk keys:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```
