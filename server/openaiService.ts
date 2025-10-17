// import { randomUUID } from "crypto";
// import type { SourceGame, GeneratedIdea } from "@shared/schema";

// /**
//  * Hugging Face backed service for generating ONE game idea + screenshot.
//  * - Replace the previous OpenAI/Replicate service with this file.
//  * - Caps numberOfIdeas to 1 to avoid quota/rate-limit problems.
//  *
//  * Env:
//  *  - HUGGINGFACE_API_TOKEN (required)
//  *  - HUGGINGFACE_TEXT_MODEL (optional, default google/flan-t5-small)
//  *  - HUGGINGFACE_IMAGE_MODEL (optional, default stabilityai/stable-diffusion-2-1)
//  *
//  * If running Node < 18, install node-fetch and uncomment the import below:
//  *   npm install node-fetch@2
//  *   import fetch from "node-fetch";
//  */

// const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN || "";
// const HF_TEXT_MODEL = process.env.HUGGINGFACE_TEXT_MODEL || "google/flan-t5-small";
// const HF_IMAGE_MODEL = process.env.HUGGINGFACE_IMAGE_MODEL || "stabilityai/stable-diffusion-2-1";

// if (!HF_TOKEN) console.warn("HUGGINGFACE_API_TOKEN not set — generation will fail without it.");

// /* small sleep helper */
// function sleep(ms: number) {
//   return new Promise((r) => setTimeout(r, ms));
// }

// /* Generic POST to HF Inference API */
// async function hfPost(model: string, body: any, accept = "application/json") {
//   const url = `https://api-inference.huggingface.co/models/${model}`;
//   const headers: Record<string, string> = {
//     Authorization: `Bearer ${HF_TOKEN}`,
//     "Content-Type": "application/json",
//     Accept: accept,
//   };

//   const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
//   const ct = res.headers.get("content-type") || "";

//   if (!res.ok) {
//     const text = await res.text().catch(() => "");
//     const e: any = new Error(`HF ${res.status} ${res.statusText}: ${text}`);
//     e.status = res.status;
//     e.headers = res.headers;
//     throw e;
//   }

//   if (ct.includes("application/json")) {
//     return { type: "json", data: await res.json() };
//   }
//   if (ct.startsWith("image/") || ct.includes("application/octet-stream")) {
//     const buffer = Buffer.from(await res.arrayBuffer());
//     const b64 = buffer.toString("base64");
//     const mime = ct.split(";")[0] || "image/png";
//     return { type: "binary", data: `data:${mime};base64,${b64}` };
//   }

//   // fallback to text
//   const text = await res.text();
//   return { type: "text", data: text };
// }

// /* Text generation with retries */
// async function hfTextGenerate(prompt: string, model = HF_TEXT_MODEL, maxRetries = 3): Promise<string> {
//   if (!HF_TOKEN) throw new Error("HUGGINGFACE_API_TOKEN missing");

//   const body = {
//     inputs: prompt,
//     parameters: { max_new_tokens: 300, temperature: 0.2 },
//     options: { wait_for_model: true },
//   };

//   let attempt = 0;
//   while (attempt < maxRetries) {
//     attempt++;
//     try {
//       const out = await hfPost(model, body, "application/json");
//       if (out.type === "json") {
//         const data = out.data;
//         // handle array responses or { generated_text } shapes
//         if (Array.isArray(data) && data.length) {
//           const first = data[0];
//           if (typeof first === "string") return first;
//           if (first.generated_text) return first.generated_text;
//         }
//         if (data.generated_text) return data.generated_text;
//         // fallback: stringify
//         return JSON.stringify(data);
//       }
//       if (out.type === "text") return String(out.data);
//       return String(out.data);
//     } catch (err: any) {
//       const status = err?.status ?? 0;
//       if (status === 429) {
//         const wait = 1000 * attempt + Math.floor(Math.random() * 500);
//         await sleep(wait);
//         continue;
//       }
//       if (status >= 500) {
//         await sleep(500 * attempt);
//         continue;
//       }
//       throw err;
//     }
//   }
//   throw new Error("hfTextGenerate: retries exhausted");
// }

// /* Image generation with retries -> returns data:image/png;base64,... */
// async function hfImageGenerate(prompt: string, model = HF_IMAGE_MODEL, maxRetries = 3): Promise<string> {
//   if (!HF_TOKEN) throw new Error("HUGGINGFACE_API_TOKEN missing");

//   const body = { inputs: prompt, options: { wait_for_model: true } };

//   let attempt = 0;
//   while (attempt < maxRetries) {
//     attempt++;
//     try {
//       // Prefer image response when possible
//       const out = await hfPost(model, body, "image/png");
//       if (out.type === "binary") return out.data as string;
//       if (out.type === "json") {
//         const d: any = out.data;
//         // handle common shapes: array of base64 strings or { images: [...] }
//         if (Array.isArray(d) && typeof d[0] === "string") {
//           const s = d[0];
//           return s.startsWith("data:") ? s : `data:image/png;base64,${s}`;
//         }
//         if (d.images && Array.isArray(d.images) && d.images[0]) {
//           const s = d.images[0];
//           return s.startsWith("data:") ? s : `data:image/png;base64,${s}`;
//         }
//         if (d.image_base64) return `data:image/png;base64,${d.image_base64}`;
//       }
//       if (out.type === "text") {
//         const s = String(out.data).trim();
//         if (s.startsWith("http")) return s;
//         if (s.startsWith("data:")) return s;
//         return `data:image/png;base64,${s}`;
//       }
//     } catch (err: any) {
//       const status = err?.status ?? 0;
//       if (status === 429) {
//         await sleep(1000 * attempt + Math.floor(Math.random() * 500));
//         continue;
//       }
//       if (status >= 500) {
//         await sleep(500 * attempt);
//         continue;
//       }
//       throw err;
//     }
//   }
//   throw new Error("hfImageGenerate: retries exhausted");
// }

// /* ----------------
//    Deterministic local merger (fallback)
//    ---------------- */
// function safeArray<T>(v: any): T[] {
//   return Array.isArray(v) ? v : v ? [v] : [];
// }

// function placeholderImageFor(title: string, size = 1024) {
//   const text = encodeURIComponent(title.substring(0, 28));
//   return `https://placehold.co/${size}x${size}.png?text=${text}&font=roboto`;
// }

// function mergeLocally(game1: SourceGame, game2: SourceGame): Omit<GeneratedIdea, "screenshotUrl"> {
//   const name = `${(game1.name || "GameA").trim()} × ${(game2.name || "GameB").trim()}`;
//   const ctrl1 = game1.mechanics?.controllableObjects ?? "player";
//   const ctrl2 = game2.mechanics?.controllableObjects ?? "player";
//   const targ1 = game1.mechanics?.targetObjects ?? "targets";
//   const targ2 = game2.mechanics?.targetObjects ?? "targets";
//   const uniq1 = safeArray<string>(game1.uniqueMechanics).slice(0, 3);
//   const uniq2 = safeArray<string>(game2.uniqueMechanics).slice(0, 3);

//   const coreSetup = [
//     `Primary control: ${ctrl1}`,
//     `Secondary control: ${ctrl2}`,
//     `Primary targets: ${targ1}`,
//     `Secondary targets: ${targ2}`,
//     ...uniq1.map((s) => `G1: ${s}`),
//     ...uniq2.map((s) => `G2: ${s}`),
//   ].slice(0, 6);

//   const rules = [
//     ...(game1.constraintType ? [`${game1.name} constraint: ${game1.constraintType}`] : []),
//     ...(game2.constraintType ? [`${game2.name} constraint: ${game2.constraintType}`] : []),
//     `Swap control modes on special tiles`,
//     `Combine target clearing for bonus`,
//   ].slice(0, 6);

//   // Construct objective from existing source game fields (coreGameplayLoop / winCondition / loseCondition)
//   const obj1 = Array.isArray(game1.coreGameplayLoop) ? game1.coreGameplayLoop : [];
//   const obj2 = Array.isArray(game2.coreGameplayLoop) ? game2.coreGameplayLoop : [];
//   const winLose: string[] = [];
//   if (game1.winCondition) winLose.push(String(game1.winCondition));
//   if (game2.winCondition) winLose.push(String(game2.winCondition));
//   if (game1.loseCondition) winLose.push(String(game1.loseCondition));
//   if (game2.loseCondition) winLose.push(String(game2.loseCondition));

//   const objective = obj1.concat(obj2).concat(winLose).filter(Boolean);
//   if (objective.length === 0) objective.push("Clear targets or reach the highest score under constraints");

//   const challengeSource = [
//     ...(game1.mechanics?.obstacles ? [String(game1.mechanics.obstacles)] : []),
//     ...(game2.mechanics?.obstacles ? [String(game2.mechanics.obstacles)] : []),
//   ];
//   if (challengeSource.length === 0) challengeSource.push("Time and placement constraints");

//   const innovation = [`Use ${uniq1[0] ?? ctrl1} to modify ${uniq2[0] ?? ctrl2}`, `Progressive mix of both games' constraints`];

//   return {
//     id: randomUUID(),
//     name,
//     inspiredFrom: [game1.name, game2.name],
//     coreSetup,
//     rules,
//     objective: objective.slice(0, 3),
//     challengeSource: challengeSource.slice(0, 3),
//     innovation,
//   };
// }

// /* ----------------
//    Build HF prompt (strict JSON output)
//    ---------------- */
// function buildTextPromptForIdea(g1: SourceGame, g2: SourceGame) {
//   return `You are a concise mobile puzzle game designer. Merge exactly these two games into a single new game idea.

// GAME 1: ${g1.name}
// Controllable: ${g1.mechanics?.controllableObjects ?? ""}
// Targets: ${g1.mechanics?.targetObjects ?? ""}
// Core: ${(g1.uniqueMechanics ?? []).join(", ")}

// GAME 2: ${g2.name}
// Controllable: ${g2.mechanics?.controllableObjects ?? ""}
// Targets: ${g2.mechanics?.targetObjects ?? ""}
// Core: ${(g2.uniqueMechanics ?? []).join(", ")}

// Output ONLY valid JSON with keys:
// {
//  "name":"string",
//  "coreSetup":["..."],
//  "rules":["..."],
//  "objective":["..."],
//  "challengeSource":["..."],
//  "innovation":["..."],
//  "inspiredFrom":["GAME 1 NAME","GAME 2 NAME"]
// }

// CRITICAL: Do NOT add fantasy/space/robotic themes. Keep concise.`;
// }

// function parseJSONLike(raw: string) {
//   try {
//     return JSON.parse(raw);
//   } catch {
//     const m = raw.match(/\{[\s\S]*\}/);
//     if (m) {
//       try {
//         return JSON.parse(m[0]);
//       } catch {
//         return null;
//       }
//     }
//     return null;
//   }
// }

// /* ----------------
//    Public: generateGameIdeas (caps to 1)
//    ---------------- */
// export async function generateGameIdeas(sourceGames: SourceGame[], numberOfIdeas: number): Promise<GeneratedIdea[]> {
//   if (!Array.isArray(sourceGames) || sourceGames.length < 2) throw new Error("Need at least two source games.");

//   // cap at 1 to avoid quota issues
//   const count = Math.min(Math.max(1, Math.floor(numberOfIdeas || 1)), 1);

//   const ideas: GeneratedIdea[] = [];

//   // pick two distinct random games
//   const a = Math.floor(Math.random() * sourceGames.length);
//   let b = Math.floor(Math.random() * sourceGames.length);
//   while (b === a) b = Math.floor(Math.random() * sourceGames.length);
//   const g1 = sourceGames[a];
//   const g2 = sourceGames[b];

//   // attempt HF text generation, fallback to local merge
//   let parsed: any = null;
//   try {
//     const prompt = buildTextPromptForIdea(g1, g2);
//     const raw = await hfTextGenerate(prompt);
//     parsed = parseJSONLike(raw);
//   } catch (err) {
//     console.warn("HF text generation failed — using local merge fallback.", err);
//     parsed = null;
//   }

//   let ideaBase: Omit<GeneratedIdea, "screenshotUrl">;
//   if (!parsed || typeof parsed !== "object") {
//     ideaBase = mergeLocally(g1, g2);
//   } else {
//     // Normalize parsed HF output into the GeneratedIdea shape with safe defaults
//     const normalized = {
//       id: randomUUID(),
//       name: typeof parsed.name === "string" ? parsed.name : `${g1.name} × ${g2.name}`,
//       inspiredFrom: Array.isArray(parsed.inspiredFrom) && parsed.inspiredFrom.length === 2 ? parsed.inspiredFrom : [g1.name, g2.name],
//       coreSetup: Array.isArray(parsed.coreSetup) ? parsed.coreSetup.filter(Boolean).map(String) : [],
//       rules: Array.isArray(parsed.rules) ? parsed.rules.filter(Boolean).map(String) : [],
//       objective: Array.isArray(parsed.objective) ? parsed.objective.filter(Boolean).map(String) : [],
//       challengeSource: Array.isArray(parsed.challengeSource) ? parsed.challengeSource.filter(Boolean).map(String) : [],
//       innovation: Array.isArray(parsed.innovation) ? parsed.innovation.filter(Boolean).map(String) : [],
//     } as Omit<GeneratedIdea, "screenshotUrl">;

//     // If key arrays are empty, log a warning and fallback to local merge to guarantee useful output
//     const missingCritical = !normalized.coreSetup.length || !normalized.rules.length || !normalized.objective.length || !normalized.challengeSource.length || !normalized.innovation.length;
//     if (missingCritical) {
//       console.warn("HF produced incomplete idea, falling back to local merge:", parsed);
//       ideaBase = mergeLocally(g1, g2);
//     } else {
//       ideaBase = normalized;
//     }
//   }

//   // produce image (try HF, fallback to placeholder)
//   let screenshotUrl = "";
//   try {
//     const imgPrompt = `High-quality mobile puzzle game screenshot for "${ideaBase.name}". Style: colorful flat sprites, readable HUD, grid layout, merge visual traits from ${g1.name} and ${g2.name}. No sci-fi or fantasy.`;
//     screenshotUrl = await hfImageGenerate(imgPrompt);
//   } catch (err) {
//     console.warn("HF image generation failed — using placeholder image.", err);
//     screenshotUrl = placeholderImageFor(ideaBase.name, 1024);
//   }

//   ideas.push({ ...ideaBase, screenshotUrl });

//   // brief pause to avoid burst
//   await sleep(200);

//   return ideas;
// }


import { randomUUID } from "crypto";
import type { SourceGame, GeneratedIdea } from "@shared/schema";

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN || "";
const HF_TEXT_MODEL = process.env.HUGGINGFACE_TEXT_MODEL || "google/flan-t5-small";
const HF_IMAGE_MODEL = process.env.HUGGINGFACE_IMAGE_MODEL || "stabilityai/stable-diffusion-2-1";

if (!HF_TOKEN) console.warn("HUGGINGFACE_API_TOKEN not set – generation will fail without it.");

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function hfPost(model: string, body: any, accept = "application/json") {
  const url = `https://api-inference.huggingface.co/models/${model}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${HF_TOKEN}`,
    "Content-Type": "application/json",
    Accept: accept,
  };

  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  const ct = res.headers.get("content-type") || "";

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const e: any = new Error(`HF ${res.status} ${res.statusText}: ${text}`);
    e.status = res.status;
    e.headers = res.headers;
    throw e;
  }

  if (ct.includes("application/json")) {
    return { type: "json", data: await res.json() };
  }
  if (ct.startsWith("image/") || ct.includes("application/octet-stream")) {
    const buffer = Buffer.from(await res.arrayBuffer());
    const b64 = buffer.toString("base64");
    const mime = ct.split(";")[0] || "image/png";
    return { type: "binary", data: `data:${mime};base64,${b64}` };
  }

  const text = await res.text();
  return { type: "text", data: text };
}

async function hfTextGenerate(prompt: string, model = HF_TEXT_MODEL, maxRetries = 3): Promise<string> {
  if (!HF_TOKEN) throw new Error("HUGGINGFACE_API_TOKEN missing");

  const body = {
    inputs: prompt,
    parameters: { max_new_tokens: 300, temperature: 0.2 },
    options: { wait_for_model: true },
  };

  let attempt = 0;
  while (attempt < maxRetries) {
    attempt++;
    try {
      const out = await hfPost(model, body, "application/json");
      if (out.type === "json") {
        const data = out.data;
        if (Array.isArray(data) && data.length) {
          const first = data[0];
          if (typeof first === "string") return first;
          if (first.generated_text) return first.generated_text;
        }
        if (data.generated_text) return data.generated_text;
        return JSON.stringify(data);
      }
      if (out.type === "text") return String(out.data);
      return String(out.data);
    } catch (err: any) {
      const status = err?.status ?? 0;
      if (status === 429) {
        const wait = 1000 * attempt + Math.floor(Math.random() * 500);
        await sleep(wait);
        continue;
      }
      if (status >= 500) {
        await sleep(500 * attempt);
        continue;
      }
      throw err;
    }
  }
  throw new Error("hfTextGenerate: retries exhausted");
}

async function hfImageGenerate(prompt: string, model = HF_IMAGE_MODEL, maxRetries = 3): Promise<string> {
  if (!HF_TOKEN) throw new Error("HUGGINGFACE_API_TOKEN missing");

  const body = { inputs: prompt, options: { wait_for_model: true } };

  let attempt = 0;
  while (attempt < maxRetries) {
    attempt++;
    try {
      const out = await hfPost(model, body, "image/png");
      if (out.type === "binary") return out.data as string;
      if (out.type === "json") {
        const d: any = out.data;
        if (Array.isArray(d) && typeof d[0] === "string") {
          const s = d[0];
          return s.startsWith("data:") ? s : `data:image/png;base64,${s}`;
        }
        if (d.images && Array.isArray(d.images) && d.images[0]) {
          const s = d.images[0];
          return s.startsWith("data:") ? s : `data:image/png;base64,${s}`;
        }
        if (d.image_base64) return `data:image/png;base64,${d.image_base64}`;
      }
      if (out.type === "text") {
        const s = String(out.data).trim();
        if (s.startsWith("http")) return s;
        if (s.startsWith("data:")) return s;
        return `data:image/png;base64,${s}`;
      }
    } catch (err: any) {
      const status = err?.status ?? 0;
      if (status === 429) {
        await sleep(1000 * attempt + Math.floor(Math.random() * 500));
        continue;
      }
      if (status >= 500) {
        await sleep(500 * attempt);
        continue;
      }
      throw err;
    }
  }
  throw new Error("hfImageGenerate: retries exhausted");
}

function safeArray<T>(v: any): T[] {
  return Array.isArray(v) ? v : v ? [v] : [];
}

function placeholderImageFor(title: string, size = 1024) {
  const text = encodeURIComponent(title.substring(0, 28));
  return `https://placehold.co/${size}x${size}.png?text=${text}&font=roboto`;
}

// Generate creative game name by combining key elements
function generateCreativeName(game1: SourceGame, game2: SourceGame): string {
  const g1Words = game1.name.split(" ");
  const g2Words = game2.name.split(" ");
  
  // Extract key nouns from game names
  const g1Key = g1Words[g1Words.length - 1]; // e.g., "Away", "Rush", "Out"
  const g2Key = g2Words[0]; // e.g., "Drop", "Sky", "Gecko"
  
  // Combine in creative ways
  const combinations = [
    `${g2Key} ${g1Key}`,
    `${g1Key} ${g2Key}`,
    `${g2Words[0]} to ${g1Words[0]}`,
  ];
  
  return combinations[Math.floor(Math.random() * combinations.length)];
}

function mergeLocally(game1: SourceGame, game2: SourceGame): Omit<GeneratedIdea, "screenshotUrl"> {
  const name = generateCreativeName(game1, game2);
  const ctrl1 = game1.mechanics?.controllableObjects ?? "player";
  const ctrl2 = game2.mechanics?.controllableObjects ?? "player";
  const targ1 = game1.mechanics?.targetObjects ?? "targets";
  const targ2 = game2.mechanics?.targetObjects ?? "targets";
  const uniq1 = safeArray<string>(game1.uniqueMechanics).slice(0, 3);
  const uniq2 = safeArray<string>(game2.uniqueMechanics).slice(0, 3);

  const coreSetup = [
    `Primary control: ${ctrl1}`,
    `Secondary control: ${ctrl2}`,
    `Primary targets: ${targ1}`,
    `Secondary targets: ${targ2}`,
    ...uniq1.map((s) => `G1: ${s}`),
    ...uniq2.map((s) => `G2: ${s}`),
  ].slice(0, 6);

  const rules = [
    ...(game1.constraintType ? [`${game1.name} constraint: ${game1.constraintType}`] : []),
    ...(game2.constraintType ? [`${game2.name} constraint: ${game2.constraintType}`] : []),
    `Swap control modes on special tiles`,
    `Combine target clearing for bonus`,
  ].slice(0, 6);

  const obj1 = Array.isArray(game1.coreGameplayLoop) ? game1.coreGameplayLoop : [];
  const obj2 = Array.isArray(game2.coreGameplayLoop) ? game2.coreGameplayLoop : [];
  const winLose: string[] = [];
  if (game1.winCondition) winLose.push(String(game1.winCondition));
  if (game2.winCondition) winLose.push(String(game2.winCondition));
  if (game1.loseCondition) winLose.push(String(game1.loseCondition));
  if (game2.loseCondition) winLose.push(String(game2.loseCondition));

  const objective = obj1.concat(obj2).concat(winLose).filter(Boolean);
  if (objective.length === 0) objective.push("Clear targets or reach the highest score under constraints");

  const challengeSource = [
    ...(game1.mechanics?.obstacles ? [String(game1.mechanics.obstacles)] : []),
    ...(game2.mechanics?.obstacles ? [String(game2.mechanics.obstacles)] : []),
  ];
  if (challengeSource.length === 0) challengeSource.push("Time and placement constraints");

  const innovation = [`Use ${uniq1[0] ?? ctrl1} to modify ${uniq2[0] ?? ctrl2}`, `Progressive mix of both games' constraints`];

  return {
    id: randomUUID(),
    name,
    inspiredFrom: [game1.name, game2.name],
    coreSetup,
    rules,
    objective: objective.slice(0, 3),
    challengeSource: challengeSource.slice(0, 3),
    innovation,
  };
}

function buildTextPromptForIdea(g1: SourceGame, g2: SourceGame) {
  return `You are a creative mobile puzzle game designer. Merge these two games into ONE new innovative game with a UNIQUE, CATCHY NAME.

GAME 1: ${g1.name}
Controllable: ${g1.mechanics?.controllableObjects ?? ""}
Targets: ${g1.mechanics?.targetObjects ?? ""}
Core: ${(g1.uniqueMechanics ?? []).join(", ")}

GAME 2: ${g2.name}
Controllable: ${g2.mechanics?.controllableObjects ?? ""}
Targets: ${g2.mechanics?.targetObjects ?? ""}
Core: ${(g2.uniqueMechanics ?? []).join(", ")}

CRITICAL REQUIREMENTS:
1. Create a UNIQUE, MEMORABLE game name (like "Hole Rush" or "Bus to Hole Drop") - DO NOT just combine game names with "×" or "+"
2. The name should be 2-3 words maximum and catchy
3. Keep the mechanics grounded in source games only
4. No fantasy, space, or sci-fi themes

Output ONLY valid JSON:
{
 "name":"[UNIQUE CATCHY NAME HERE]",
 "coreSetup":["..."],
 "rules":["..."],
 "objective":["..."],
 "challengeSource":["..."],
 "innovation":["..."],
 "inspiredFrom":["${g1.name}","${g2.name}"]
}`;
}

function parseJSONLike(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function generateGameIdeas(sourceGames: SourceGame[], numberOfIdeas: number): Promise<GeneratedIdea[]> {
  if (!Array.isArray(sourceGames) || sourceGames.length < 2) throw new Error("Need at least two source games.");

  const count = Math.min(Math.max(1, Math.floor(numberOfIdeas || 1)), 1);
  const ideas: GeneratedIdea[] = [];

  const a = Math.floor(Math.random() * sourceGames.length);
  let b = Math.floor(Math.random() * sourceGames.length);
  while (b === a) b = Math.floor(Math.random() * sourceGames.length);
  const g1 = sourceGames[a];
  const g2 = sourceGames[b];

  let parsed: any = null;
  try {
    const prompt = buildTextPromptForIdea(g1, g2);
    const raw = await hfTextGenerate(prompt);
    parsed = parseJSONLike(raw);
  } catch (err) {
    console.warn("HF text generation failed – using local merge fallback.", err);
    parsed = null;
  }

  let ideaBase: Omit<GeneratedIdea, "screenshotUrl">;
  if (!parsed || typeof parsed !== "object") {
    ideaBase = mergeLocally(g1, g2);
  } else {
    const normalized = {
      id: randomUUID(),
      name: typeof parsed.name === "string" && parsed.name.length > 0 ? parsed.name : generateCreativeName(g1, g2),
      inspiredFrom: Array.isArray(parsed.inspiredFrom) && parsed.inspiredFrom.length === 2 ? parsed.inspiredFrom : [g1.name, g2.name],
      coreSetup: Array.isArray(parsed.coreSetup) ? parsed.coreSetup.filter(Boolean).map(String) : [],
      rules: Array.isArray(parsed.rules) ? parsed.rules.filter(Boolean).map(String) : [],
      objective: Array.isArray(parsed.objective) ? parsed.objective.filter(Boolean).map(String) : [],
      challengeSource: Array.isArray(parsed.challengeSource) ? parsed.challengeSource.filter(Boolean).map(String) : [],
      innovation: Array.isArray(parsed.innovation) ? parsed.innovation.filter(Boolean).map(String) : [],
    } as Omit<GeneratedIdea, "screenshotUrl">;

    const missingCritical = !normalized.coreSetup.length || !normalized.rules.length || !normalized.objective.length || !normalized.challengeSource.length || !normalized.innovation.length;
    if (missingCritical) {
      console.warn("HF produced incomplete idea, falling back to local merge:", parsed);
      ideaBase = mergeLocally(g1, g2);
    } else {
      ideaBase = normalized;
    }
  }

  let screenshotUrl = "";
  try {
    const imgPrompt = `Mobile puzzle game screenshot for "${ideaBase.name}". High quality, colorful flat design with clear UI. Grid-based layout with visible game elements. Art style: bright colors, clean sprites, readable text, professional mobile game interface. Visual inspiration from ${g1.name} (${g1.mechanics?.controllableObjects}) merged with ${g2.name} (${g2.mechanics?.controllableObjects}). Show actual gameplay grid with colored objects, clear HUD elements, timer or score display. Realistic mobile game screenshot quality, NOT concept art. Bright, vibrant, polished mobile game graphics.`;
    screenshotUrl = await hfImageGenerate(imgPrompt);
  } catch (err) {
    console.warn("HF image generation failed – using placeholder image.", err);
    screenshotUrl = placeholderImageFor(ideaBase.name, 1024);
  }

  ideas.push({ ...ideaBase, screenshotUrl });
  await sleep(200);

  return ideas;
}