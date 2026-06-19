# Barcode Character Generator

A mobile-first Next.js + TypeScript MVP for a web/cloud Codex environment. It scans a barcode with the device camera, treats the barcode digits as a deterministic seed, and generates a safe text prompt for an original anime-inspired female character.

## What it does

- Scans barcodes in-browser with `@zxing/browser`.
- Shows the scanned barcode value.
- Deterministically maps barcode digits to character traits:
  - hair color
  - eye color
  - hairstyle
  - outfit style
  - personality
  - accessory
  - visual theme
  - background setting
  - season
  - time of day
  - weather
  - mood / expression
  - scene event
- Generates a polished AI image prompt as text only.
- Displays the scene event separately and groups traits/prompt in collapsible sections.
- Copies the generated prompt to the clipboard.
- Lets you scan again.
- Handles unsupported camera APIs, camera permission denial, and scanner startup errors.

## Safety and scope

This app intentionally does **not** perform product lookup, infer brands, mention real brands, call an image generation API, or generate images. Prompts require original adult anime-inspired female characters and include guardrails for no brand names, no logos, no readable labels, no copyrighted characters, no artist references, and no studio references. Scene wording stays wholesome and story-driven, allowing playful or mildly suggestive situations only when they arise naturally from activity, weather, clothing, or setting.

## Install and run

```bash
npm install
npm run dev
```

Open the local URL shown by Next.js on a phone or browser with a camera. Camera access generally requires `https://` or `localhost`.

## Build

```bash
npm run build
```

The static export is written to `out/`. To preview it locally after building, run:

```bash
npm run preview
```

## Deploy on Vercel Hobby

This project is designed for Vercel Hobby using the standard Next.js framework preset. It does not use Docker, Kubernetes, Azure, AWS ECS, managed databases, product lookup APIs, image generation APIs, or other cloud-specific services. The scanner and prompt generator run in the browser, and `next.config.ts` enables static export output for a simple serverless/static deployment path.

Suggested Vercel settings:

- Framework preset: `Next.js`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `out`

## Barcode → seed → traits logic

The scanner reads the barcode text, then `lib/generateCharacter.ts` keeps only numeric digits. Those digits are hashed with a small deterministic FNV-style hash to create a stable unsigned integer seed. Reusable helper functions mix that seed with a fixed salt for each category, then select one item from expandable trait lists in `lib/traits/`. Because the source digits, hash, salts, and arrays are stable, the same barcode digits always produce the same scene event, traits, and prompt.


## Trait data organization

Trait options live in separate files under `lib/traits/` so they can be expanded without editing React components. The deterministic generation logic, prompt construction rules, and quality/safety instructions live in `lib/generateCharacter.ts`.
