import Image from "next/image";
import { Flame, MessageCircle, Shuffle, UsersRound } from "lucide-react";
import { ForumClient } from "@/components/forum-client";
import { GuestChip } from "@/components/guest-chip";
import { GuestEntry } from "@/components/guest-entry";
import { readGuest } from "@/lib/guest";
import { randomGuestName } from "@/lib/guest-names";

export default async function Home() {
  const guest = await readGuest();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand" aria-label="Ani-Sho">
          <span className="brand-mark">
            <Flame size={23} strokeWidth={2.5} />
          </span>
          <span>Ani-Sho</span>
        </div>
        <nav className="nav-actions" aria-label="Guest profile">
          {guest ? <GuestChip name={guest.name} avatarId={guest.avatarId} /> : null}
        </nav>
      </header>

      {guest ? (
        <ForumClient />
      ) : (
        <section className="signed-out-stage">
          <div className="signed-out-copy">
            <p className="eyebrow">anime topic gauntlet</p>
            <h1>Ani-Sho</h1>
            <GuestEntry suggestedName={randomGuestName()} />
          </div>
          <ChatPreview />
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
      )}
    </main>
  );
}

function ChatPreview() {
  return (
    <div className="chat-preview" aria-hidden="true">
      <div className="chat-preview-head">
        <span>
          <MessageCircle size={18} />
          Topic room
        </span>
        <strong>One Piece</strong>
      </div>
      <div className="chat-topic-card">
        Which crew member has the strongest emotional arc?
      </div>
      <div className="chat-bubble bubble-left">
        <span>Mika</span>
        Robin. That backstory still wins every time.
      </div>
      <div className="chat-bubble bubble-right">
        <span>You</span>
        Sanji is close though. Whole Cake Island was brutal.
      </div>
      <div className="chat-bubble bubble-left">
        <span>Mika</span>
        Fair, but “I want to live” ended the debate.
      </div>
      <div className="chat-input-preview">Drop your take...</div>
    </div>
  );
}
