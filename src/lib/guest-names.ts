export const GUEST_NAME_MAX = 20;

const adjectives = [
  "Swift",
  "Crimson",
  "Lucky",
  "Midnight",
  "Solar",
  "Quiet",
  "Turbo",
  "Cosmic",
  "Brave",
  "Sleepy"
];

const nouns = [
  "Ronin",
  "Otaku",
  "Senpai",
  "Kitsune",
  "Tanuki",
  "Mecha",
  "Comet",
  "Ninja",
  "Onigiri",
  "Sensei"
];

function pick(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export function randomGuestName() {
  const number = Math.floor(Math.random() * 90) + 10;

  return `${pick(adjectives)}${pick(nouns)}${number}`;
}

export function cleanGuestName(input: string) {
  return input
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, GUEST_NAME_MAX)
    .trim();
}
