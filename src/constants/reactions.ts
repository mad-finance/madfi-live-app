export const reactionsMap = {
  clap: "👏",
  heart: "❤️",
  fire: "🔥",
  rocket: "🚀",
  star: "⭐",
  party: "🎉",
  money: "💰",
  thumbsup: "👍",
};

export const reactionsEntries = Object.entries(reactionsMap);
// const reactionsKeys = Object.keys(reactionsMap);

export type ReactionsTypes = keyof typeof reactionsMap;