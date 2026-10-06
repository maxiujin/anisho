# Ani-Sho

An anime debate gauntlet. Pick an avatar, enter the queue, get randomly paired with another fan, and debate one of ten anime topics in a chat room.

No sign-up and no API keys. Clone it and it runs.

## Quick start

Requires Node.js 20 or newer.

```bash
git clone https://github.com/maxiujin/anibate.git
cd anibate
npm install
npm run dev
```

Open http://localhost:3000.

To try a full match on one machine, open the site in two different browsers (or one normal window and one private window), enter as a guest in each, and press **Enter gauntlet** in both.

## How it works

- **Guests, not accounts.** Entering creates a random token stored in an httpOnly cookie along with your chosen name and avatar. It lasts a week, or until you press **Switch**. See `src/lib/guest.ts`.
- **Avatars.** Three built-in profile pictures live in `public/avatars` and are listed in `src/lib/avatars.ts`.
- **Matchmaking and chat.** The queue, rooms, and messages are held in server memory (`src/lib/forum-store.ts`). The browser polls `/api/gauntlet` every 2.5 seconds.
- **Topics.** The ten debate topics are in `src/lib/topics.ts`.

## Project layout

```
src/app/page.tsx              landing page and gauntlet shell
src/app/api/guest/route.ts    start or end a guest session
src/app/api/gauntlet/route.ts join, leave, send message, poll state
src/components/               guest picker, header chip, gauntlet UI
src/lib/                      guest session, avatars, topics, in-memory store
public/avatars/               avatar images
```

## Scripts

```bash
npm run dev     # local dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Contributing

1. Fork the repo and create a branch.
2. Make your change and run `npm run lint` and `npm run build`.
3. Open a pull request against `main`.

Merged pull requests are deployed to the live site automatically.

Good first changes: add a topic in `src/lib/topics.ts`, or add an avatar (drop a square image in `public/avatars` and add one line to `src/lib/avatars.ts`).

Never commit secrets. The app needs none; see `.env.example`.

## Known limitations

- State is in memory, so rooms and chats reset when the server restarts.
- On serverless hosts, separate server instances do not share memory, so two players can occasionally land on different instances and not see each other. A shared store would fix this and is a welcome contribution, as long as local development keeps working with no keys.
- Guest sessions have no moderation or rate limiting yet.

## License

[MIT](LICENSE)
