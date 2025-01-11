import {
  EMOJI_MAP,
  EmojiName,
  getRandomEmojiName,
  getEmojiByName,
} from "./emoji";

const USER_KEY = "totali_user";

export const EMOJI_NAMES = Object.keys(EMOJI_MAP) as EmojiName[];

export interface User {
  name: string;
  emojiName: EmojiName;
}

export const userStorage = {
  getUser: (): User | null => {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    return JSON.parse(data);
  },

  setUser: (name: string, emojiName: EmojiName = getRandomEmojiName()) => {
    const user: User = {
      name,
      emojiName,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  clearUser: () => {
    localStorage.removeItem(USER_KEY);
  },
};
