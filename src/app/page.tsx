import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";
import Image from "next/image";
import { Flame, Shuffle, UsersRound } from "lucide-react";
import { ForumClient } from "@/components/forum-client";
import { isClerkConfigured } from "@/lib/clerk-config";

export default function Home() {
  if (!isClerkConfigured()) {
    return <ClerkSetupRequired />;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand" aria-label="Ani-Sho">
          <span className="brand-mark">
            <Flame size={23} strokeWidth={2.5} />
          </span>
          <span>Ani-Sho</span>
        </div>
        <nav className="nav-actions" aria-label="Account">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </header>

      <SignedOut>
        <section className="signed-out-stage">
          <div className="signed-out-copy">
            <p className="eyebrow">anime topic gauntlet</p>
            <h1>Ani-Sho</h1>
            <div className="hero-actions">
              <SignUpButton mode="modal">
                <button className="primary-button large google-button">
                  <GoogleMark />
                  Continue with Google
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="secondary-button large">Sign in</button>
              </SignInButton>
            </div>
          </div>
          <div className="match-preview" aria-hidden="true">
            <div className="anime-face-wrap">
              <Image
                className="anime-face-image"
                src="/anime-line-face-transparent.png"
                alt=""
                width={1240}
                height={1240}
                priority
              />
            </div>
            <div className="preview-ring">
              <span>DBZ</span>
              <Shuffle size={30} />
              <span>OP</span>
            </div>
            <div className="preview-row">
              <UsersRound size={20} />
              <span>random pair incoming</span>
            </div>
          </div>
        </section>
      </SignedOut>

      <SignedIn>
        <ForumClient />
      </SignedIn>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg
      className="google-mark"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.1 3.5-8.6Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3a7.3 7.3 0 0 1-10.8-3.8h-4v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.2 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.7 0 3.3.6 4.5 1.8L20 3.1A12 12 0 0 0 1.2 6.6l4 3.1A7.1 7.1 0 0 1 12 4.8Z"
      />
    </svg>
  );
}

function ClerkSetupRequired() {
  return (
    <main className="setup-page">
      <section className="setup-panel">
        <div className="brand setup-brand">
          <span className="brand-mark">
            <Flame size={23} strokeWidth={2.5} />
          </span>
          <span>Ani-Sho</span>
        </div>
        <p className="eyebrow">clerk setup needed</p>
        <h1>Add Clerk keys to run the gauntlet.</h1>
        <p>
          Set <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and{" "}
          <code>CLERK_SECRET_KEY</code> in <code>.env.local</code>.
        </p>
      </section>
    </main>
  );
}
