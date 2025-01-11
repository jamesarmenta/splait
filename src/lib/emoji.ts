export const EMOJI_MAP = {
  airplane: "✈️",
  alien: "👽",
  apple: "🍎",
  avocado: "🥑",
  bacon: "🥓",
  bagel: "🥯",
  banana: "🍌",
  bathtub: "🛁",
  bee: "🐝",
  beer: "🍺",
  bicycle: "🚲",
  bird: "🐦",
  blue: "🔵",
  boat: "⛵",
  bone: "🦴",
  book: "📖",
  brain: "🧠",
  briefcase: "💼",
  broccoli: "🥦",
  brown: "🟤",
  bubbles: "🫧",
  butterfly: "🦋",
  cactus: "🌵",
  cake: "🎂",
  camel: "🐫",
  camera: "📷",
  candy: "🍬",
  car: "🚗",
  carrot: "🥕",
  cat: "🐈",
  caterpillar: "🐛",
  cheese: "🧀",
  chefhand: "🤌",
  cherry: "🍒",
  chicken: "🐔",
  chocolate: "🍫",
  clapping: "👏",
  cloud: "☁️",
  coconut: "🥥",
  coffee: "☕",
  computer: "💻",
  cool: "😎",
  cookie: "🍪",
  corn: "🌽",
  cow: "🐄",
  crab: "🦀",
  crown: "👑",
  crystalball: "🔮",
  curry: "🍛",
  dance: "💃",
  diamond: "💎",
  dinosaur: "🦖",
  dog: "🐕",
  dolphin: "🐬",
  donut: "🍩",
  dragon: "🐉",
  drink: "🍹",
  duck: "🦆",
  elephant: "🐘",
  eyes: "👀",
  fire: "🔥",
  fish: "🐠",
  flower: "🌸",
  fries: "🍟",
  frog: "🐸",
  game: "🎮",
  ghost: "👻",
  gift: "🎁",
  gift: "🎁",
  grape: "🍇",
  green: "🟢",
  guitar: "🎸",
  gyoza: "🥟",
  hamburger: "🍔",
  hand: "✋",
  happy: "😊",
  heart: "💖",
  hearthands: "🫶",
  holiday: "🎄",
  hotdog: "🌭",
  house: "🏠",
  icecream: "🍦",
  jackolantern: "🎃",
  key: "🔑",
  ladybug: "🐞",
  leaves: "🌿",
  lightning: "⚡️",
  llama: "🦙",
  lobster: "🦞",
  lock: "🔒",
  martini: "🍸",
  mask: "👹",
  money: "💰",
  monkey: "🐒",
  moon: "🌙",
  mouth: "👄",
  mushroom: "🍄",
  music: "🎵",
  ocean: "🌊",
  octopus: "🐙",
  olive: "🫒",
  orange: "🍊",
  otter: "🦦",
  owl: "🦉",
  parrot: "🦜",
  party: "🎉",
  peace: "✌️",
  piano: "🎹",
  pineapple: "🍍",
  pizza: "🍕",
  popcorn: "🍿",
  pretzel: "🥨",
  purple: "🟣",
  rain: "🌧️",
  rainbow: "🌈",
  red: "🔴",
  rice: "🍚",
  ring: "💍",
  robot: "🤖",
  rocket: "🚀",
  rose: "🌹",
  sandwich: "🥪",
  scorpion: "🦂",
  seal: "🦭",
  sheep: "🐑",
  shrimp: "🦐",
  silhoutte: "👤",
  sloth: "🦥",
  snail: "🐌",
  snake: "🐍",
  snowman: "⛄",
  soccer: "⚽",
  spider: "🕷️",
  spiderweb: "🕸️",
  squid: "🦑",
  star: "⭐️",
  strawberry: "🍓",
  sun: "☀️",
  sushi: "🍣",
  sweetpotato: "🍠",
  tongue: "👅",
  train: "🚂",
  travel: "✈️",
  tree: "🌳",
  turtle: "🐢",
  umbrella: "☔",
  unicorn: "🦄",
  water: "💧",
  watermelon: "🍉",
  whale: "🐳",
  wine: "🍷",
  yellow: "🟡",
  zebra: "🦓",
};

export type EmojiName = keyof typeof EMOJI_MAP;

export const getEmojiByName = (name: EmojiName): string => EMOJI_MAP[name];

export const getRandomEmojiName = (): EmojiName => {
  const keys = Object.keys(EMOJI_MAP) as EmojiName[];
  return keys[Math.floor(Math.random() * keys.length)];
};
