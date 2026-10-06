import { createHash, randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { z } from "zod";
import { avatarIds, type AvatarId } from "@/lib/avatars";
import { cleanGuestName, randomGuestName } from "@/lib/guest-names";

// Guests are identified by a random token kept in an httpOnly cookie.
// There are no accounts, no keys, and nothing to configure.
const COOKIE_NAME = "anisho_guest";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const cookieSchema = z.object({
  token: z.string().uuid(),
  name: z.string().min(1).max(64),
  avatarId: z.enum(avatarIds)
});

export type GuestProfile = {
  id: string;
  name: string;
  avatarId: AvatarId;
};

// The public id is a hash of the token, so other players never see the
// value that would let them act as this guest.
function publicId(token: string) {
  return `guest_${createHash("sha256").update(token).digest("hex").slice(0, 16)}`;
}

export async function readGuest(): Promise<GuestProfile | null> {
  const raw = (await cookies()).get(COOKIE_NAME)?.value;

  if (!raw) {
    return null;
  }

  try {
    const parsed = cookieSchema.safeParse(
      JSON.parse(Buffer.from(raw, "base64url").toString("utf8"))
    );

    if (!parsed.success) {
      return null;
    }

    return {
      id: publicId(parsed.data.token),
      name: cleanGuestName(parsed.data.name) || "Anime fan",
      avatarId: parsed.data.avatarId
    };
  } catch {
    return null;
  }
}

export async function startGuest(input: { name: string; avatarId: AvatarId }) {
  const token = randomUUID();
  const name = cleanGuestName(input.name) || randomGuestName();
  const value = Buffer.from(
    JSON.stringify({ token, name, avatarId: input.avatarId })
  ).toString("base64url");

  // Secure on https deployments, plain on http://localhost so local
  // production builds work in every browser.
  const secure = (await headers()).get("x-forwarded-proto") === "https";

  (await cookies()).set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: COOKIE_MAX_AGE
  });

  return { id: publicId(token), name, avatarId: input.avatarId };
}

export async function endGuest() {
  (await cookies()).delete(COOKIE_NAME);
}
