const USER_KEY = "totali_user";

// Default emojis to choose from
export const DEFAULT_EMOJIS = [
  "👤",
  "😊",
  "🙂",
  "😎",
  "🤓",
  "🤠",
  "👻",
  "🐱",
  "🐶",
  "🦊",
  "🦁",
  "🐯",
  "🐸",
  "🐙",
  "🦄",
  "🦋",
  "🌟",
  "🍕",
  "🌈",
  "🎨",
];

export interface User {
  name: string;
  emoji: string;
}

export const userStorage = {
  getUser: (): User | null => {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    return JSON.parse(data);
  },

  setUser: (name: string, emoji: string = DEFAULT_EMOJIS[0]) => {
    const user: User = {
      name,
      emoji,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  clearUser: () => {
    localStorage.removeItem(USER_KEY);
  },
};
