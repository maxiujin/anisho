export type Topic = {
  id: string;
  title: string;
  shortName: string;
  color: "red" | "orange" | "blue";
  prompt: string;
  opener: string;
};

export const topics: Topic[] = [
  {
    id: "dragon-ball",
    title: "Dragon Ball",
    shortName: "DBZ",
    color: "orange",
    prompt: "Which saga had the best power jump without losing the plot?",
    opener: "Best transformation: earned legend or pure hype?"
  },
  {
    id: "one-piece",
    title: "One Piece",
    shortName: "OP",
    color: "blue",
    prompt: "Which crew member has the strongest emotional arc?",
    opener: "Is the best island the funniest one or the one that hurts most?"
  },
  {
    id: "pokemon",
    title: "Pokemon",
    shortName: "PKMN",
    color: "red",
    prompt: "Which region feels most complete as an adventure?",
    opener: "Starter loyalty check: power pick or heart pick?"
  },
  {
    id: "yugioh",
    title: "Yu-Gi-Oh!",
    shortName: "YGO",
    color: "orange",
    prompt: "Which duel had the cleanest comeback?",
    opener: "Was the heart of the cards skill, chaos, or both?"
  },
  {
    id: "naruto",
    title: "Naruto",
    shortName: "NRT",
    color: "blue",
    prompt: "Which rival dynamic carried the most weight?",
    opener: "Best jutsu: tactical masterpiece or impossible flex?"
  },
  {
    id: "bleach",
    title: "Bleach",
    shortName: "BLCH",
    color: "red",
    prompt: "Which Bankai reveal still owns the room?",
    opener: "Soul Society arc: perfect arc or nostalgia boost?"
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer",
    shortName: "DS",
    color: "orange",
    prompt: "Which Hashira fight had the strongest emotional payoff?",
    opener: "Does animation elevate the story or reveal what was always there?"
  },
  {
    id: "attack-on-titan",
    title: "Attack on Titan",
    shortName: "AOT",
    color: "blue",
    prompt: "Which reveal changed how you saw every earlier episode?",
    opener: "Best twist: world lore, character motive, or battle strategy?"
  },
  {
    id: "my-hero-academia",
    title: "My Hero Academia",
    shortName: "MHA",
    color: "red",
    prompt: "Which hero society flaw makes the story hit hardest?",
    opener: "Best quirk: raw power, utility, or personality match?"
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    shortName: "JJK",
    color: "orange",
    prompt: "Which domain expansion says the most about its user?",
    opener: "Best fight choreography: clean tactics or total pressure?"
  }
];

export function getRandomTopic() {
  return topics[Math.floor(Math.random() * topics.length)];
}

export function getTopic(topicId: string) {
  return topics.find((topic) => topic.id === topicId) ?? topics[0];
}
