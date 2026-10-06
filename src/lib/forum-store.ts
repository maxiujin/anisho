import type { AvatarId } from "@/lib/avatars";
import { getRandomTopic, getTopic, topics, type Topic } from "@/lib/topics";

const ONLINE_TTL = 1000 * 60 * 30;

export type ForumUser = {
  id: string;
  name: string;
  avatarId: AvatarId;
  lastSeen: number;
  status: "online" | "queued" | "matched";
  roomId?: string;
};

export type ChatMessage = {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  avatarId?: AvatarId;
  body: string;
  createdAt: number;
  system?: boolean;
};

type Room = {
  id: string;
  topicId: string;
  participantIds: string[];
  createdAt: number;
  open: boolean;
  messages: ChatMessage[];
};

type WaitingTicket = {
  userId: string;
  joinedAt: number;
};

type ForumStore = {
  users: Map<string, ForumUser>;
  waiting: WaitingTicket[];
  rooms: Map<string, Room>;
};

declare global {
  var animeGauntletStore: ForumStore | undefined;
}

function store() {
  if (!globalThis.animeGauntletStore) {
    globalThis.animeGauntletStore = {
      users: new Map(),
      waiting: [],
      rooms: new Map()
    };
  }

  return globalThis.animeGauntletStore;
}

function id(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function prune() {
  const now = Date.now();
  const state = store();

  for (const [userId, user] of state.users.entries()) {
    if (now - user.lastSeen > ONLINE_TTL) {
      state.users.delete(userId);
    }
  }

  state.waiting = state.waiting.filter((ticket) => state.users.has(ticket.userId));

  for (const room of state.rooms.values()) {
    const hasActiveParticipant = room.participantIds.some((userId) =>
      state.users.has(userId)
    );

    if (!hasActiveParticipant && now - room.createdAt > ONLINE_TTL) {
      state.rooms.delete(room.id);
    }
  }
}

export function touchUser(profile: { id: string; name: string; avatarId: AvatarId }) {
  prune();

  const state = store();
  const existing = state.users.get(profile.id);
  const user: ForumUser = {
    id: profile.id,
    name: profile.name,
    avatarId: profile.avatarId,
    lastSeen: Date.now(),
    status: existing?.status ?? "online",
    roomId: existing?.roomId
  };

  state.users.set(profile.id, user);

  return user;
}

export function snapshot(userId: string) {
  prune();

  const state = store();
  const onlineUsers = [...state.users.values()]
    .sort((a, b) => b.lastSeen - a.lastSeen)
    .map(publicUser);
  const user = state.users.get(userId);
  const currentRoom = user?.roomId ? state.rooms.get(user.roomId) : undefined;

  return {
    topics,
    currentUser: user ? publicUser(user) : null,
    onlineUsers,
    activeRooms: [...state.rooms.values()].filter((room) => room.open).length,
    queueCount: state.waiting.length,
    currentRoom: currentRoom?.open ? publicRoom(currentRoom) : null
  };
}

export function joinGauntlet(userId: string) {
  prune();

  const state = store();
  const user = state.users.get(userId);

  if (!user) {
    return snapshot(userId);
  }

  const currentRoom = user.roomId ? state.rooms.get(user.roomId) : undefined;

  if (currentRoom?.open) {
    return snapshot(userId);
  }

  state.waiting = state.waiting.filter((ticket) => ticket.userId !== userId);

  const possiblePartners = state.waiting.filter((ticket) => ticket.userId !== userId);
  const partnerTicket =
    possiblePartners[Math.floor(Math.random() * possiblePartners.length)];

  if (!partnerTicket) {
    user.status = "queued";
    user.roomId = undefined;
    state.waiting.push({ userId, joinedAt: Date.now() });
    return snapshot(userId);
  }

  state.waiting = state.waiting.filter(
    (ticket) => ticket.userId !== partnerTicket.userId
  );

  const partner = state.users.get(partnerTicket.userId);
  const topic = getRandomTopic();
  const roomId = id("room");
  const room: Room = {
    id: roomId,
    topicId: topic.id,
    participantIds: [userId, partnerTicket.userId],
    createdAt: Date.now(),
    open: true,
    messages: [
      {
        id: id("msg"),
        roomId,
        userId: "system",
        userName: "Gauntlet",
        body: `${topic.title}: ${topic.opener}`,
        createdAt: Date.now(),
        system: true
      }
    ]
  };

  user.status = "matched";
  user.roomId = room.id;

  if (partner) {
    partner.status = "matched";
    partner.roomId = room.id;
  }

  state.rooms.set(room.id, room);

  return snapshot(userId);
}

export function leaveGauntlet(userId: string) {
  prune();

  const state = store();
  const user = state.users.get(userId);
  state.waiting = state.waiting.filter((ticket) => ticket.userId !== userId);

  if (user?.roomId) {
    const room = state.rooms.get(user.roomId);

    if (room) {
      room.open = false;

      for (const participantId of room.participantIds) {
        const participant = state.users.get(participantId);

        if (participant) {
          participant.status = "online";
          participant.roomId = undefined;
        }
      }
    }
  }

  if (user) {
    user.status = "online";
    user.roomId = undefined;
  }

  return snapshot(userId);
}

export function removeUser(userId: string) {
  leaveGauntlet(userId);
  store().users.delete(userId);
}

export function sendMessage(
  userId: string,
  body: string
): { ok: boolean; state: ReturnType<typeof snapshot> } {
  prune();

  const state = store();
  const user = state.users.get(userId);
  const room = user?.roomId ? state.rooms.get(user.roomId) : undefined;
  const cleanBody = body.trim().slice(0, 480);

  if (!user || !room?.open || !cleanBody) {
    return { ok: false, state: snapshot(userId) };
  }

  room.messages.push({
    id: id("msg"),
    roomId: room.id,
    userId,
    userName: user.name,
    avatarId: user.avatarId,
    body: cleanBody,
    createdAt: Date.now()
  });

  room.messages = room.messages.slice(-80);

  return { ok: true, state: snapshot(userId) };
}

function publicUser(user: ForumUser) {
  return {
    id: user.id,
    name: user.name,
    avatarId: user.avatarId,
    status: user.status,
    lastSeen: user.lastSeen
  };
}

function publicRoom(room: Room) {
  const state = store();
  const topic = getTopic(room.topicId);

  return {
    id: room.id,
    topic: publicTopic(topic),
    participants: room.participantIds
      .map((participantId) => state.users.get(participantId))
      .filter(Boolean)
      .map((user) => publicUser(user as ForumUser)),
    messages: room.messages
  };
}

function publicTopic(topic: Topic) {
  return {
    id: topic.id,
    title: topic.title,
    shortName: topic.shortName,
    color: topic.color,
    prompt: topic.prompt,
    opener: topic.opener
  };
}
