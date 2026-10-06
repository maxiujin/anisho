"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Activity,
  Flame,
  Gamepad2,
  Ghost,
  Medal,
  MessageCircle,
  Radio,
  Send,
  Shield,
  Shuffle,
  Sparkles,
  Swords,
  Trophy,
  UsersRound,
  X,
  Zap
} from "lucide-react";
import { getAvatar, type AvatarId } from "@/lib/avatars";

const topicIcons = [
  Flame,
  Swords,
  Sparkles,
  Gamepad2,
  Shield,
  Zap,
  Trophy,
  Ghost,
  Medal
];

type Topic = {
  id: string;
  title: string;
  shortName: string;
  color: "red" | "orange" | "blue";
  prompt: string;
  opener: string;
};

type PublicUser = {
  id: string;
  name: string;
  avatarId: AvatarId;
  status: "online" | "queued" | "matched";
  lastSeen: number;
};

type ChatMessage = {
  id: string;
  userId: string;
  userName: string;
  avatarId?: AvatarId;
  body: string;
  createdAt: number;
  system?: boolean;
};

type Room = {
  id: string;
  topic: Topic;
  participants: PublicUser[];
  messages: ChatMessage[];
};

type ForumState = {
  topics: Topic[];
  currentUser: PublicUser | null;
  onlineUsers: PublicUser[];
  activeRooms: number;
  queueCount: number;
  currentRoom: Room | null;
};

export function ForumClient() {
  const [state, setState] = useState<ForumState | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fetchState = useCallback(async () => {
    const response = await fetch("/api/gauntlet", { cache: "no-store" });

    if (response.status === 401) {
      // Guest cookie expired or was cleared: go back to the avatar picker.
      window.location.reload();
      return;
    }

    if (!response.ok) {
      throw new Error("Unable to load gauntlet");
    }

    setState(await response.json());
  }, []);

  useEffect(() => {
    fetchState().catch(() => setError("Could not connect to the gauntlet."));
    const interval = window.setInterval(() => {
      fetchState().catch(() => undefined);
    }, 2500);

    return () => window.clearInterval(interval);
  }, [fetchState]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [state?.currentRoom?.messages.length]);

  const currentRoom = state?.currentRoom;
  const currentUserId = state?.currentUser?.id;
  const partner = useMemo(() => {
    return currentRoom?.participants.find((user) => user.id !== currentUserId);
  }, [currentRoom?.participants, currentUserId]);

  async function runAction(body: unknown) {
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/gauntlet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error("Action failed");
      }

      setState(await response.json());
    } catch {
      setError("That move did not land. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    const body = message;
    setMessage("");
    await runAction({ action: "message", body });
  }

  if (!state) {
    return (
      <section className="forum-grid loading-grid">
        <div className="panel loading-panel">
          <Radio size={24} />
          <span>Opening gauntlet...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="forum-grid">
      <aside className="panel roster-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">online</p>
            <h2>{state.onlineUsers.length} users</h2>
          </div>
          <UsersRound size={24} />
        </div>
        <div className="stat-row">
          <span>
            <Activity size={16} />
            {state.activeRooms} rooms
          </span>
          <span>
            <Shuffle size={16} />
            {state.queueCount} queued
          </span>
        </div>
        <div className="user-list" aria-label="Online users">
          {state.onlineUsers.map((user) => (
            <div className="user-row" key={user.id}>
              <Avatar user={user} />
              <div>
                <strong>{user.name}</strong>
                <span>{statusLabel(user.status)}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="panel gauntlet-panel">
        <div className="panel-heading main-heading">
          <div>
            <p className="eyebrow">topic gauntlet</p>
            <h2>{currentRoom ? currentRoom.topic.title : "Spin for a matchup"}</h2>
          </div>
          <div className="gauntlet-mark">
            <Swords size={28} />
          </div>
        </div>

        {error ? <p className="error-line">{error}</p> : null}

        {currentRoom ? (
          <div className="room-stage">
            <div className={`topic-banner ${currentRoom.topic.color}`}>
              <div>
                <span>{currentRoom.topic.shortName}</span>
                <h3>{currentRoom.topic.prompt}</h3>
              </div>
              <button
                className="icon-button"
                type="button"
                onClick={() => runAction({ action: "leave" })}
                disabled={busy}
                aria-label="Leave room"
                title="Leave room"
              >
                <X size={18} />
              </button>
            </div>

            <div className="versus-row">
              <ParticipantBadge user={state.currentUser} label="you" />
              <span className="versus-pill">vs</span>
              <ParticipantBadge user={partner} label="paired" />
            </div>

            <div className="message-list" aria-label="Chat messages">
              {currentRoom.messages.map((chatMessage) => {
                if (chatMessage.system) {
                  return (
                    <div className="message-row system-message" key={chatMessage.id}>
                      <p>{chatMessage.body}</p>
                    </div>
                  );
                }

                const own = chatMessage.userId === currentUserId;

                return (
                  <div
                    className={own ? "message-line own-line" : "message-line"}
                    key={chatMessage.id}
                  >
                    <AvatarImage avatarId={chatMessage.avatarId} />
                    <div className={own ? "message-row own-message" : "message-row"}>
                      <strong>{chatMessage.userName}</strong>
                      <p>{chatMessage.body}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form className="composer" onSubmit={submitMessage}>
              <input
                aria-label="Message"
                maxLength={480}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Drop your take..."
                value={message}
              />
              <button
                className="icon-button send-button"
                type="submit"
                disabled={busy || !message.trim()}
                aria-label="Send message"
                title="Send message"
              >
                <Send size={19} />
              </button>
            </form>
          </div>
        ) : (
          <div className="queue-stage">
            <div className="queue-core">
              <Flame size={42} />
              <h3>
                {state.currentUser?.status === "queued"
                  ? "Waiting for the next fan"
                  : "Ready for a random anime debate"}
              </h3>
            </div>
            <button
              className="primary-button spin-button"
              type="button"
              disabled={busy || state.currentUser?.status === "queued"}
              onClick={() => runAction({ action: "join" })}
            >
              <Shuffle size={19} />
              Enter gauntlet
            </button>
            {state.currentUser?.status === "queued" ? (
              <button
                className="secondary-button"
                type="button"
                disabled={busy}
                onClick={() => runAction({ action: "leave" })}
              >
                Leave queue
              </button>
            ) : null}
          </div>
        )}
      </section>

      <aside className="panel topic-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">shows</p>
            <h2>10 topics</h2>
          </div>
          <MessageCircle size={24} />
        </div>
        <div className="topic-list" aria-label="Anime topics">
          {state.topics.map((topic, index) => {
            const Icon = topicIcons[index % topicIcons.length];
            return (
              <div className={`topic-row ${topic.color}`} key={topic.id}>
                <Icon size={18} />
                <span>{topic.title}</span>
              </div>
            );
          })}
        </div>
      </aside>
    </section>
  );
}

function statusLabel(status: PublicUser["status"]) {
  if (status === "queued") {
    return "in queue";
  }

  if (status === "matched") {
    return "in room";
  }

  return "online";
}

function AvatarImage({ avatarId }: { avatarId?: AvatarId }) {
  return (
    <Image
      className="avatar"
      src={getAvatar(avatarId).src}
      alt=""
      width={38}
      height={38}
    />
  );
}

function Avatar({ user }: { user: PublicUser }) {
  return <AvatarImage avatarId={user.avatarId} />;
}

function ParticipantBadge({
  user,
  label
}: {
  user?: PublicUser | null;
  label: string;
}) {
  return (
    <div className="participant-badge">
      {user ? <Avatar user={user} /> : <span className="avatar fallback-avatar">?</span>}
      <div>
        <strong>{user?.name ?? "Waiting"}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
