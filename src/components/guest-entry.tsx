"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dices, Swords } from "lucide-react";
import { avatars, type AvatarId } from "@/lib/avatars";
import { GUEST_NAME_MAX, randomGuestName } from "@/lib/guest-names";

export function GuestEntry({ suggestedName }: { suggestedName: string }) {
  const router = useRouter();
  const [avatarId, setAvatarId] = useState<AvatarId>(avatars[0].id);
  const [name, setName] = useState(suggestedName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function enter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatarId })
      });

      if (!response.ok) {
        throw new Error("Guest start failed");
      }

      router.refresh();
    } catch {
      setError("Could not start a guest session. Try again.");
      setBusy(false);
    }
  }

  return (
    <form className="guest-entry" onSubmit={enter}>
      <fieldset className="avatar-picker">
        <legend className="eyebrow">pick your fighter</legend>
        <div className="avatar-options">
          {avatars.map((avatar) => (
            <label
              className={
                avatar.id === avatarId ? "avatar-option selected" : "avatar-option"
              }
              key={avatar.id}
            >
              <input
                type="radio"
                name="avatar"
                value={avatar.id}
                checked={avatar.id === avatarId}
                onChange={() => setAvatarId(avatar.id)}
              />
              <Image src={avatar.src} alt="" width={160} height={160} priority />
              <span>{avatar.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="eyebrow" htmlFor="guest-name">
        guest name
      </label>
      <div className="name-row">
        <input
          id="guest-name"
          autoComplete="off"
          maxLength={GUEST_NAME_MAX}
          onChange={(event) => setName(event.target.value)}
          placeholder="Leave blank for a random name"
          value={name}
        />
        <button
          className="secondary-button name-shuffle"
          type="button"
          onClick={() => setName(randomGuestName())}
          aria-label="Random name"
          title="Random name"
        >
          <Dices size={19} />
        </button>
      </div>

      {error ? <p className="error-line">{error}</p> : null}

      <button className="primary-button large enter-button" type="submit" disabled={busy}>
        <Swords size={19} />
        Enter as guest
      </button>
      <p className="guest-note">No sign-up. Your guest profile lives in this browser for a week.</p>
    </form>
  );
}
