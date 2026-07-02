import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";
import Image from "next/image";
import { Flame, LogIn, Shuffle, UsersRound } from "lucide-react";
import { ForumClient } from "@/components/forum-client";
import { isClerkConfigured } from "@/lib/clerk-config";

export default function Home() {
  if (!isClerkConfigured()) {
    return <ClerkSetupRequired />;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand" aria-label="Vies Anime Gauntlet">
          <span className="brand-mark">
            <Flame size={23} strokeWidth={2.5} />
          </span>
          <span>Vies</span>
        </div>
        <nav className="nav-actions" aria-label="Account">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="ghost-button">
                <LogIn size={18} />
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </header>

      <SignedOut>
        <section className="signed-out-stage">
          <div className="signed-out-copy">
            <p className="eyebrow">anime topic gauntlet</p>
            <h1>Vies</h1>
            <div className="hero-actions">
              <SignUpButton mode="modal">
                <button className="primary-button large">Continue with Google</button>
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

function ClerkSetupRequired() {
  return (
    <main className="setup-page">
      <section className="setup-panel">
        <div className="brand setup-brand">
          <span className="brand-mark">
            <Flame size={23} strokeWidth={2.5} />
          </span>
          <span>Vies</span>
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
