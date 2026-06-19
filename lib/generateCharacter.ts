import { accessories } from "./traits/accessories";
import { backgrounds } from "./traits/backgrounds";
import { eyeColors } from "./traits/eyeColors";
import { hairColors } from "./traits/hairColors";
import { hairstyles } from "./traits/hairstyles";
import { moods } from "./traits/moods";
import { outfitStyles } from "./traits/outfitStyles";
import { personalities } from "./traits/personalities";
import { sceneEvents } from "./traits/sceneEvents";
import { seasons } from "./traits/seasons";
import { timesOfDay } from "./traits/timesOfDay";
import { visualThemes } from "./traits/visualThemes";
import { weatherConditions } from "./traits/weatherConditions";

export type CharacterTraits = {
  hairColor: string;
  eyeColor: string;
  hairstyle: string;
  outfitStyle: string;
  personality: string;
  accessory: string;
  visualTheme: string;
  background: string;
  season: string;
  timeOfDay: string;
  weather: string;
  mood: string;
  sceneEvent: string;
};

export type CharacterResult = {
  barcode: string;
  seed: number;
  traits: CharacterTraits;
  prompt: string;
};

const qualityInstructions = [
  "anime-inspired original adult female character",
  "clean line art",
  "balanced proportions",
  "accurate hands and fingers",
  "natural anatomy",
  "soft shading",
  "warm cohesive color palette",
  "character-focused composition",
  "simple background",
  "background secondary to the character",
  "shallow depth of field",
  "soft cinematic lighting",
  "wholesome mood",
  "detailed character design",
  "no logos",
  "no brand names",
  "no readable product labels",
  "no copyrighted characters",
  "no artist references",
  "no studio references",
];

function normalizeBarcode(value: string): string {
  return value.replace(/\D/g, "");
}

function hashDigits(digits: string): number {
  let hash = 2166136261;

  // Deterministic FNV-style hashing turns the same digit string into the same unsigned seed.
  for (const digit of digits) {
    hash ^= digit.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function mixSeed(seed: number, salt: number): number {
  let mixed = seed ^ Math.imul(salt + 1, 2246822519);
  mixed ^= mixed >>> 16;
  mixed = Math.imul(mixed, 3266489917);
  mixed ^= mixed >>> 13;
  return mixed >>> 0;
}

function pick<T>(items: readonly T[], seed: number, salt: number): T {
  return items[mixSeed(seed, salt) % items.length];
}

function buildPrompt(traits: CharacterTraits): string {
  return [
    `${traits.season} ${traits.timeOfDay} in a ${traits.background}, ${traits.weather}, ${traits.visualTheme} atmosphere.`,
    `An original adult woman is ${traits.sceneEvent}, wearing ${traits.outfitStyle} with ${traits.accessory}.`,
    `She has ${traits.hairColor} ${traits.hairstyle}, ${traits.eyeColor} eyes, and a ${traits.personality} presence.`,
    `Her mood is a ${traits.mood}; incidental movement from the activity and weather feels natural, playful, and story-driven.`,
    "Cinematic composition with the character as the clear focus and the background kept secondary, balanced proportions, natural anatomy, no voyeuristic framing, no explicit content.",
    qualityInstructions.join(", "),
  ].join(" ");
}

export function generateCharacterFromBarcode(value: string): CharacterResult | null {
  const barcode = normalizeBarcode(value);

  if (!barcode) {
    return null;
  }

  const seed = hashDigits(barcode);

  // Each category uses the shared seed plus a stable salt, so traits remain repeatable and expandable.
  const traits: CharacterTraits = {
    hairColor: pick(hairColors, seed, 1),
    eyeColor: pick(eyeColors, seed, 2),
    hairstyle: pick(hairstyles, seed, 3),
    outfitStyle: pick(outfitStyles, seed, 4),
    personality: pick(personalities, seed, 5),
    accessory: pick(accessories, seed, 6),
    visualTheme: pick(visualThemes, seed, 7),
    background: pick(backgrounds, seed, 8),
    season: pick(seasons, seed, 9),
    timeOfDay: pick(timesOfDay, seed, 10),
    weather: pick(weatherConditions, seed, 11),
    mood: pick(moods, seed, 12),
    sceneEvent: pick(sceneEvents, seed, 13),
  };

  return {
    barcode,
    seed,
    traits,
    prompt: buildPrompt(traits),
  };
}
