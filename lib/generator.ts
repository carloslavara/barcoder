export type CharacterTraits = {
  hairColor: string;
  eyeColor: string;
  outfitStyle: string;
  personalityArchetype: string;
  accessory: string;
  visualTheme: string;
  backgroundSetting: string;
};

export type CharacterResult = {
  barcode: string;
  seed: number;
  traits: CharacterTraits;
  prompt: string;
};

const hairColors = [
  "midnight blue",
  "rose pink",
  "silver white",
  "warm chestnut",
  "lavender",
  "mint green",
  "sunset orange",
  "soft black",
  "pearl blonde",
  "crimson red",
];

const eyeColors = [
  "emerald green",
  "sapphire blue",
  "amber gold",
  "violet",
  "storm gray",
  "teal",
  "honey brown",
  "ruby red",
  "icy blue",
  "soft hazel",
];

const outfitStyles = [
  "layered streetwear with a cropped jacket and pleated skirt",
  "cozy oversized sweater with a ribboned skirt",
  "futuristic explorer outfit with matte fabric panels",
  "elegant academy uniform with original crest-free details",
  "pastel magical adventurer dress without symbols or logos",
  "sporty hoodie and shorts with clean graphic-free fabric",
  "classic fantasy traveler cloak and tunic",
  "modern cafe outfit with apron-like layers and no labels",
  "celestial-themed dress with star-shaped trim",
  "rainy-day coat with boots and a soft scarf",
];

const personalityArchetypes = [
  "cheerful inventor",
  "quiet strategist",
  "brave optimist",
  "gentle booklover",
  "mischievous performer",
  "calm protector",
  "curious stargazer",
  "determined athlete",
  "kindhearted gardener",
  "dreamy musician",
];

const accessories = [
  "moon hairclip",
  "round glasses",
  "tiny satchel",
  "ribbon choker",
  "star earrings",
  "fingerless gloves",
  "paintbrush charm bracelet",
  "flower crown",
  "decorative headphones with no branding",
  "small lantern pendant",
];

const visualThemes = [
  "soft neon glow",
  "spring blossoms",
  "crystal sparkle",
  "cozy autumn warmth",
  "ocean breeze",
  "starlit wonder",
  "rain-kissed reflections",
  "sunlit meadow",
  "gentle cyber-fantasy",
  "dreamy watercolor atmosphere",
];

const backgroundSettings = [
  "quiet rooftop garden at sunset",
  "floating library with glowing shelves",
  "peaceful train platform in light rain",
  "small greenhouse filled with fictional flowers",
  "moonlit observatory balcony",
  "cozy bedroom art corner",
  "lantern-lit fantasy village street",
  "futuristic skybridge above a clean city",
  "seaside promenade with soft clouds",
  "calm forest path with sparkling fireflies",
];

function normalizeBarcode(value: string): string {
  return value.replace(/\D/g, "");
}

function hashDigits(digits: string): number {
  let hash = 2166136261;

  for (const digit of digits) {
    hash ^= digit.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pick<T>(items: readonly T[], seed: number, salt: number): T {
  const index = ((seed + Math.imul(salt, 2654435761)) >>> 0) % items.length;
  return items[index];
}

export function generateCharacterFromBarcode(value: string): CharacterResult | null {
  const barcode = normalizeBarcode(value);

  if (!barcode) {
    return null;
  }

  const seed = hashDigits(barcode);
  const traits: CharacterTraits = {
    hairColor: pick(hairColors, seed, barcode.length + 1),
    eyeColor: pick(eyeColors, seed, barcode.length + 3),
    outfitStyle: pick(outfitStyles, seed, barcode.length + 5),
    personalityArchetype: pick(personalityArchetypes, seed, barcode.length + 7),
    accessory: pick(accessories, seed, barcode.length + 11),
    visualTheme: pick(visualThemes, seed, barcode.length + 13),
    backgroundSetting: pick(backgroundSettings, seed, barcode.length + 17),
  };

  const prompt = [
    "Original anime-inspired adult female character,",
    `${traits.personalityArchetype} expression and posture,`,
    `${traits.hairColor} hair, ${traits.eyeColor} eyes,`,
    `wearing ${traits.outfitStyle},`,
    `featuring a ${traits.accessory},`,
    `${traits.visualTheme} visual theme,`,
    `standing in a ${traits.backgroundSetting}.`,
    "Clean composition, vibrant colors, wholesome mood, detailed character design, no brand names, no logos, no readable product labels, no copyrighted characters, no artist or studio style references.",
  ].join(" ");

  return { barcode, seed, traits, prompt };
}
