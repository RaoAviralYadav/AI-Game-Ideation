# AI Game Ideation Agent

An intelligent AI-powered system that automatically generates innovative mobile game concepts by merging mechanics from existing puzzle games. Built with React, TypeScript, Node.js, and Hugging Face AI models, this application creates unique game ideas complete with professional-quality screenshots.

➡️ View Live Demo: (Add your deployment URL here)

---

## Showcase

🎮 Generated Game Ideas with Professional Screenshots

## Gecko Jam- App preview 
![Default](https://github.com/RaoAviralYadav/AI-Game-Ideation/blob/9ec8f141b210a07c772a675e9c9a05e76fb50566/screenshots/Gecko%20Jam%20-2.gif)
- Gecko Jam - Image
![Default](https://github.com/RaoAviralYadav/AI-Game-Ideation/blob/9ec8f141b210a07c772a675e9c9a05e76fb50566/screenshots/Gecko%20Jam%20image.png)
## Out Crowd - Image
![](https://github.com/RaoAviralYadav/AI-Game-Ideation/blob/9ec8f141b210a07c772a675e9c9a05e76fb50566/screenshots/Out%20Crowd%20image.png)
- Out Crowd - Description
![](https://github.com/RaoAviralYadav/AI-Game-Ideation/blob/9ec8f141b210a07c772a675e9c9a05e76fb50566/screenshots/Out%20Crowd.png)
## Gecko Match - Image
![](https://github.com/RaoAviralYadav/AI-Game-Ideation/blob/9ec8f141b210a07c772a675e9c9a05e76fb50566/screenshots/Gecko%20Match.png)
- Gecko Match - Description
![](https://github.com/RaoAviralYadav/AI-Game-Ideation/blob/9ec8f141b210a07c772a675e9c9a05e76fb50566/screenshots/Gecko%20Match%20image.png)
## Knit Jam - Image
![](https://github.com/RaoAviralYadav/AI-Game-Ideation/blob/9ec8f141b210a07c772a675e9c9a05e76fb50566/screenshots/knit%20jam%20image.png)
- Knit Jam - Description
![](https://github.com/RaoAviralYadav/AI-Game-Ideation/blob/9ec8f141b210a07c772a675e9c9a05e76fb50566/screenshots/Knit%20Jam%20.png)
## Gecko Rush - Image
![](https://github.com/RaoAviralYadav/AI-Game-Ideation/blob/9ec8f141b210a07c772a675e9c9a05e76fb50566/screenshots/Gecko%20Rush%20image.png)
- Gecko Rush - Description
![](https://github.com/RaoAviralYadav/AI-Game-Ideation/blob/9ec8f141b210a07c772a675e9c9a05e76fb50566/screenshots/Gecko%20Rush%20image-%202.png)

## Table of Contents

1. About The Project
2. Key Features
3. How It Works
   - System Architecture
   - Game Generation Logic
   - Image Generation Pipeline
4. Tech Stack
5. Folder Structure
6. Getting Started
   - Prerequisites
   - Environment Setup
   - Installation
   - Available Scripts
7. Component Documentation
8. API Documentation
9. Project Constraints & Design Decisions

---

## About The Project

This project addresses a critical challenge in game design: generating fresh, innovative game concepts by intelligently combining mechanics from proven successful games. Unlike manual brainstorming or generic AI outputs, this system specifically merges mechanics from 7 documented mobile puzzle games to create realistic, playable game concepts with high-quality visual mockups.

The AI agent doesn't just throw random ideas together—it understands game mechanics, template types (closed grids, two-layer systems, three-layer systems), constraint types (time-based, space-based), and how different game elements interact. This results in coherent, innovative concepts that game developers can immediately evaluate and prototype.

### The Challenge

Traditional AI image generators fail at creating realistic game screenshots because:

- Pure text prompts produce generic, concept-art style images
- They lack understanding of mobile game UI conventions
- Generated images don't match the visual consistency of real games
- No reference to source material results in disconnected aesthetics

### The Solution

This system overcomes these limitations by:

- Structured Game Knowledge: Uses a comprehensive database documenting 7 source games with detailed mechanics, templates, and visual characteristics
- Intelligent Merging: AI analyzes controllable objects, target objects, obstacles, and unique mechanics to create logical combinations
- Reference-Based Image Generation: Provides detailed prompts referencing specific source game visual styles
- Fallback Mechanisms: Implements local merge algorithms when AI services are unavailable
- Creative Naming: Generates catchy, memorable game names (e.g., "Hole Rush", "Bus to Hole Drop") instead of generic combinations

---

## Key Features

### ✨ Intelligent Game Ideation

- Automated Merging: Randomly selects and intelligently merges 2 games from a database of 7 source games
- Structured Output: Generates comprehensive game documents including:
  - Core Setup: Grid layout, layer systems, key objects and properties
  - Rules: Interaction mechanics, movement systems, matching/clearing conditions
  - Objective: Win conditions and player goals
  - Challenge Source: Strategic elements, constraints, and difficulty factors
  - Innovation: Unique combinations and differentiators from source games
- Creative Naming: AI-generated catchy, memorable game titles (2-3 words)
- Source Attribution: Always tracks which games inspired each idea

### 🎨 Professional Screenshot Generation

- Reference-Based Rendering: Uses source game visual characteristics to guide image generation
- Mobile Game Aesthetics: Bright colors, clear UI, readable text, grid layouts
- Quality Fallbacks: Placeholder images when generation fails
- Expandable Lightbox: Click any screenshot to view full-size with darkened backdrop

### 🎮 Source Game Library

The system draws from 7 meticulously documented mobile puzzle games:

- Drop Away (Rollic) - Hole absorption puzzle with colored holes and characters
- Sky Rush (Rollic) - Bus evacuation puzzle with passenger boarding
- Gecko Out (Rollic) - Snake navigation through irregular mazes
- Park Match (Supersonic) - Queue management with FIFO passenger boarding
- Block Jam (Voodoo) - Match-3 sorting with sleeping/awake character states
- Knit Out (Rollic) - Thread processing with automatic collection mechanics
- Crowd Express (Rollic) - Directional traffic puzzle with path blocking

Each game is documented with:

- Template type (Closed Grid, Two-Layer, Three-Layer systems)
- Constraint type (Time-based, Space-based)
- Interaction methods (Tap & Move, Tap only)
- Core mechanics (controllable objects, targets, obstacles)
- Strategic elements and innovation factors

---

## How It Works

### System Architecture

Client-server architecture with a clear separation of concerns:

FRONTEND (React)
- Hero Section, Loading State, Game Idea Cards
- Source Games Display Section

HTTP POST /api/generate-ideas -> Backend (Node.js/Express)

BACKEND (Node.js/Express)
- Route Handler (`routes.ts`) validates requests and calls `generateGameIdeas()`
- Game Generation Service (`openaiService.ts`) performs:
  1. Select 2 random games
  2. Generate game concept via Hugging Face Text API
  3. Generate screenshot via Hugging Face Image API
  4. Return completed game idea
- Game Database (`gameDatabase.ts`) stores 7 source games

API Calls -> HUGGING FACE INFERENCE API (Text & Image models)

### Game Generation Logic

Core generation pipeline:

1. Game Selection

```js
// Randomly select 2 distinct games from the database
const a = Math.floor(Math.random() * sourceGames.length);
let b = Math.floor(Math.random() * sourceGames.length);
while (b === a) b = Math.floor(Math.random() * sourceGames.length);
```

2. Creative Name Generation

```js
function generateCreativeName(game1, game2) {
  const g1Words = game1.name.split(" ");
  const g2Words = game2.name.split(" ");

  const combinations = [
    `${g2Words[0]} ${g1Words[g1Words.length - 1]}`,
    `${g1Words[g1Words.length - 1]} ${g2Words[0]}`,
    `${g2Words[0]} to ${g1Words[0]}`,
  ];

  return combinations[Math.floor(Math.random() * combinations.length)];
}
```

3. AI Text Generation with Structured Prompt

The system sends a carefully crafted prompt to Hugging Face and expects a strict JSON output containing keys:
`name`, `coreSetup[]`, `rules[]`, `objective[]`, `challengeSource[]`, `innovation[]`, `inspiredFrom[]`.

4. Response Parsing with Fallback

```js
let parsed = parseJSONLike(aiResponse);
if (!parsed || missingCriticalFields) {
  // Fall back to deterministic local merge
  ideaBase = mergeLocally(game1, game2);
} else {
  ideaBase = normalizeAndValidate(parsed);
}
```

5. Local Merge Algorithm (Fallback)

```js
function mergeLocally(game1, game2) {
  const name = generateCreativeName(game1, game2);

  const coreSetup = [
    `Primary control: ${game1.controllableObjects}`,
    `Secondary control: ${game2.controllableObjects}`,
    `Primary targets: ${game1.targetObjects}`,
    `Secondary targets: ${game2.targetObjects}`,
    ...game1.uniqueMechanics.slice(0, 3),
    ...game2.uniqueMechanics.slice(0, 3),
  ];

  const rules = [
    `${game1.name} constraint: ${game1.constraintType}`,
    `${game2.name} constraint: ${game2.constraintType}`,
    `Swap control modes on special tiles`,
    `Combine target clearing for bonus`,
  ];

  const objective = [
    ...game1.coreGameplayLoop,
    ...game2.coreGameplayLoop,
    game1.winCondition,
    game2.winCondition,
  ];

  const challengeSource = [
    game1.obstacles,
    game2.obstacles,
    "Time and placement constraints",
  ];

  const innovation = [
    `Use ${game1.uniqueMechanics[0]} to modify ${game2.uniqueMechanics[0]}`,
    `Progressive mix of both games' constraints`,
  ];

  return { name, coreSetup, rules, objective, challengeSource, innovation };
}
```

### Image Generation Pipeline

Detailed visual prompt construction and retry logic are used to create high-quality screenshots. The pipeline prefers binary image responses from the HF Inference API and converts them to base64 data URLs for immediate use in the UI. Retries with backoff are used for rate limits and transient errors. On failure, a placeholder image is used.

---

## Tech Stack

### Frontend

- React 18
- TypeScript 5
- Tailwind CSS 3
- Wouter (routing)
- TanStack Query
- Lucide React
- shadcn/ui

### Backend

- Node.js 18+
- Express 4
- TypeScript
- Zod (schema validation)
- dotenv

### AI & ML

- Hugging Face Inference API (Flan-T5 for text, Stable Diffusion for images)
- Local deterministic merging fallback

### Development Tools

- Vite 5
- ESLint
- PostCSS

---

## Folder Structure

```
/
├── client/                          # Frontend React application
├── server/                          # Backend Node.js application
├── shared/                          # Shared types between client/server
├── .env                             # Environment variables (gitignored)
├── .env.example                     # Environment template
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── vite.config.ts                   # Vite build configuration
└── README.md                        # This file
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js v18.0.0 or later
- npm v9.0.0 or later
- Hugging Face account

### Environment Setup

Create a Hugging Face API Token:

1. Go to Hugging Face Settings → Access Tokens
2. Create a new token with read access
3. Copy the token (starts with `hf_...`)

Configure Environment Variables:

```bash
cp .env.example .env

# Edit .env and add your tokens
HUGGINGFACE_API_TOKEN=hf_your_token_here

# Optional: Custom model selections
HUGGINGFACE_TEXT_MODEL=google/flan-t5-small
HUGGINGFACE_IMAGE_MODEL=stabilityai/stable-diffusion-2-1

# Optional server config
PORT=5000
NODE_ENV=development
```

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/ai-game-ideation-agent.git
cd ai-game-ideation-agent
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open your browser: http://localhost:5000

### Available Scripts

- `npm run dev` - Starts both the Express backend and Vite dev server with hot reload.
- `npm run build` - Produces an optimized production build.
- `npm start` - Runs the production build (after `npm run build`).
- `npm run check` - Type-check the project with TypeScript.

---

## Component Documentation

### GameIdeaCard

The core component for displaying generated game ideas with expandable screenshots.

Usage and props documented in the code. See `client/src/components/game-idea-card.tsx`.

### HeroSection

Props:

```ts
interface HeroSectionProps {
  onGenerate: () => void;
  isGenerating: boolean;
}
```

### LoadingState

Displays skeleton loaders during idea generation. Shows 5 skeleton cards and a status message.

### ErrorState

Props:

```ts
interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}
```

### SourceGamesSection

Gallery displaying all 7 source games. See `client/src/components/source-games-section.tsx`.

---

## API Documentation

### GET /api/source-games

Returns the complete database of source games.

Response: Array of `SourceGame` objects. See `shared/schema.ts` for full shape.

### POST /api/generate-ideas

Generates new game ideas by merging source games.

Request Body:

```json
{ "numberOfIdeas": 1 }
```

Validation (via Zod):

```ts
{ numberOfIdeas: z.number().int().min(1).max(1) }
```

Response:

```json
{
  "ideas": [
    {
      "id": "uuid",
      "name": "Hole Rush",
      "inspiredFrom": ["Sky Rush", "Drop Away"],
      "screenshotUrl": "data:image/png;base64,...",
      "coreSetup": ["..."],
      "rules": ["..."],
      "objective": ["..."],
      "challengeSource": ["..."],
      "innovation": ["..."]
    }
  ],
  "generatedAt": "2025-10-18T10:30:45.123Z"
}
```

Error Response:

```json
{ "error": "Failed to generate ideas: HuggingFace API rate limit exceeded" }
```

---

## Project Constraints & Design Decisions

### Why Limit to 1 Idea Per Generation?

- Rate Limiting: Hugging Face free tier has strict quotas. Generating multiple ideas rapidly exhausts text and image generation calls.

### Why Local Fallback Merging?

- Reliability: Ensures idea generation even when AI services fail (rate limits, 500 errors, timeouts).

### Why Hugging Face vs OpenAI/Replicate?

- Cost and flexibility make Hugging Face a practical choice. Models and slugs are configurable via environment variables.

### Why Not Use localStorage for State?

- All state is in-memory (React state) to keep artifacts short-lived and avoid storage-related complexity.

### Why Dark Theme Default?

- Dark backgrounds make colorful game screenshots pop and reduce eye strain during long ideation sessions.

---

If you'd like, I can:

- Add stricter server-side Zod validation for outgoing responses
- Add logging-to-file for malformed HF responses
- Validate and suggest working HF model slugs for text/image generation

Thank you for using AI Game Ideation Agent — happy prototyping!
