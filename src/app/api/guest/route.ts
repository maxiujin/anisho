import { NextResponse } from "next/server";
import { z } from "zod";
import { avatarIds } from "@/lib/avatars";
import { removeUser } from "@/lib/forum-store";
import { endGuest, readGuest, startGuest } from "@/lib/guest";

const startSchema = z.object({
  name: z.string().max(64).default(""),
  avatarId: z.enum(avatarIds)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = startSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Pick an avatar" }, { status: 400 });
  }

  const previous = await readGuest();

  if (previous) {
    removeUser(previous.id);
  }

  return NextResponse.json(await startGuest(parsed.data));
}

export async function DELETE() {
  const guest = await readGuest();

  if (guest) {
    removeUser(guest.id);
  }

  await endGuest();

  return NextResponse.json({ ok: true });
}
