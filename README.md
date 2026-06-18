# Barcode Character Generator

A mobile-first Next.js + TypeScript MVP for a web/cloud Codex environment. It scans a barcode with the device camera, treats the barcode digits as a deterministic seed, and generates a safe text prompt for an original anime-inspired female character.

## What it does

- Scans barcodes in-browser with `@zxing/browser`.
- Shows the scanned barcode value.
- Deterministically maps barcode digits to character traits:
  - hair color
  - eye color
  - outfit style
  - personality archetype
  - accessory
  - visual theme
  - background setting
- Generates a polished AI image prompt as text only.
- Copies the generated prompt to the clipboard.
- Lets you scan again.
- Handles unsupported camera APIs, camera permission denial, and scanner startup errors.

## Safety and scope

This app intentionally does **not** perform product lookup, infer brands, mention real brands, call an image generation API, or generate images. Prompts include guardrails for original characters, no brand names, no logos, no readable labels, no copyrighted characters, and no artist/studio style references.

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

The scanner reads the barcode text, then the generator keeps only numeric digits. Those digits are hashed with a small deterministic FNV-style hash to create a stable unsigned integer seed. Each trait category has a fixed list of safe options. The seed plus a category-specific salt selects one option from each list, so the same barcode digits always produce the same character traits and prompt.
