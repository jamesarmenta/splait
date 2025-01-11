import { EMOJI_MAP } from "./emoji";

const USER_KEY = "totali_user";

export const EMOJIS = Object.values(EMOJI_MAP);

export interface User {
  name: string;
  emoji: string;
}

export const getRandomEmoji = () => {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
};

export const userStorage = {
  getUser: (): User | null => {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    return JSON.parse(data);
  },

  setUser: (name: string, emoji: string = getRandomEmoji()) => {
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
