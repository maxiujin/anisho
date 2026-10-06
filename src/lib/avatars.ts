export const avatars = [
  { id: "beetle", label: "Beetle Knight", src: "/avatars/beetle.jpg" },
  { id: "blade", label: "Ember Blade", src: "/avatars/blade.jpg" },
  { id: "fox", label: "Fox Hoodie", src: "/avatars/fox.jpg" }
] as const;

export type AvatarId = (typeof avatars)[number]["id"];

export const avatarIds = avatars.map((avatar) => avatar.id) as [
  AvatarId,
  ...AvatarId[]
];

export function getAvatar(avatarId?: string) {
  return avatars.find((avatar) => avatar.id === avatarId) ?? avatars[0];
}
