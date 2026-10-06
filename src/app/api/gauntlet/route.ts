import { NextResponse } from "next/server";
import { z } from "zod";
import {
  joinGauntlet,
  leaveGauntlet,
  sendMessage,
  snapshot,
  touchUser
} from "@/lib/forum-store";
import { readGuest } from "@/lib/guest";

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("join") }),
  z.object({ action: z.literal("leave") }),
  z.object({ action: z.literal("message"), body: z.string().min(1).max(500) })
]);

export async function GET() {
  const profile = await readGuest();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  touchUser(profile);

  return NextResponse.json(snapshot(profile.id));
}

export async function POST(request: Request) {
  const profile = await readGuest();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  touchUser(profile);

  const body = await request.json().catch(() => null);
  const parsed = actionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  if (parsed.data.action === "join") {
    return NextResponse.json(joinGauntlet(profile.id));
  }

  if (parsed.data.action === "leave") {
    return NextResponse.json(leaveGauntlet(profile.id));
  }

  const result = sendMessage(profile.id, parsed.data.body);

  return NextResponse.json(result.state, { status: result.ok ? 200 : 409 });
}
