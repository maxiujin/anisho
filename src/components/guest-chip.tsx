"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { getAvatar, type AvatarId } from "@/lib/avatars";

export function GuestChip({ name, avatarId }: { name: string; avatarId: AvatarId }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function leave() {
    setBusy(true);
    await fetch("/api/guest", { method: "DELETE" }).catch(() => undefined);
    router.refresh();
  }

  return (
    <div className="guest-chip">
      <Image className="avatar" src={getAvatar(avatarId).src} alt="" width={38} height={38} />
      <strong>{name}</strong>
      <button
        className="ghost-button"
        type="button"
        onClick={leave}
        disabled={busy}
        title="Leave and pick a new guest profile"
      >
        <LogOut size={16} />
        Switch
      </button>
    </div>
  );
}
