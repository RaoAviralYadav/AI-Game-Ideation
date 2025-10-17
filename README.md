# AI Game Ideation Agent

An intelligent AI-powered system that automatically generates innovative mobile game concepts by merging mechanics from existing puzzle games. Built with **React**, **TypeScript**, **Node.js**, and **Hugging Face AI** models, this application creates unique game ideas complete with professional-quality screenshots.

➡️ **View Live Demo** (Add your deployment URL here)

## Showcase

### 🎮 Generated Game Ideas with Professional Screenshots

**Idea Generation Flow**
![Generation Flow](./public/screenshots/generation-flow.gif)

**Unique Game Names & Creative Mergers**
![Game Ideas](./public/screenshots/game-ideas.png)

**Expandable Screenshot Lightbox**
![Lightbox Feature](./public/screenshots/lightbox-demo.gif)

---

## Table of Contents

* [About The Project](#about-the-project)
* [Key Features](#key-features)
* [How It Works](#how-it-works)
    * [System Architecture](#system-architecture)
    * [Game Generation Logic](#game-generation-logic)
    * [Image Generation Pipeline](#image-generation-pipeline)
* [Tech Stack](#tech-stack)
* [Folder Structure](#folder-structure)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Environment Setup](#environment-setup)
    * [Installation](#installation)
    * [Available Scripts](#available-scripts)
* [Component Documentation](#component-documentation)
* [API Documentation](#api-documentation)
* [Project Constraints & Design Decisions](#project-constraints--design-decisions)

---

## About The Project

This project addresses a critical challenge in game design: generating fresh, innovative game concepts by intelligently combining mechanics from proven successful games. Unlike manual brainstorming or generic AI outputs, this system specifically merges mechanics from **7 documented mobile puzzle games** to create realistic, playable game concepts with high-quality visual mockups.

The AI agent doesn't just throw random ideas together—it understands **game mechanics**, **template types** (closed grids, two-layer systems, three-layer systems), **constraint types** (time-based, space-based), and how different game elements interact. This results in coherent, innovative concepts that game developers can immediately evaluate and prototype.

### The Challenge

Traditional AI image generators fail at creating realistic game screenshots because:

* Pure text prompts produce generic, concept-art style images
* They lack understanding of mobile game UI conventions
* Generated images don't match the visual consistency of real games
* No reference to source material results in disconnected aesthetics

### The Solution

This system overcomes these limitations by:

* **Structured Game Knowledge**: Uses a comprehensive database documenting 7 source games with detailed mechanics, templates, and visual characteristics
* **Intelligent Merging**: AI analyzes controllable objects, target objects, obstacles, and unique mechanics to create logical combinations
* **Reference-Based Image Generation**: Provides detailed prompts referencing specific source game visual styles
* **Fallback Mechanisms**: Implements local merge algorithms when AI services are unavailable
* **Creative Naming**: Generates catchy, memorable game names (e.g., "Hole Rush", "Bus to Hole Drop") instead of generic combinations

---

## Key Features

### ✨ Intelligent Game Ideation

* **Automated Merging**: Randomly selects and intelligently merges 2 games from a database of 7 source games
* **Structured Output**: Generates comprehensive game documents including:
    * **Core Setup**: Grid layout, layer systems, key objects and properties
    * **Rules**: Interaction mechanics, movement systems, matching/clearing conditions
    * **Objective**: Win conditions and player goals
    * **Challenge Source**: Strategic elements, constraints, and difficulty factors
    * **Innovation**: Unique combinations and differentiators from source games
* **Creative Naming**: AI-generated catchy, memorable game titles (2-3 words)
* **Source Attribution**: Always tracks which games inspired each idea

### 🎨 Professional Screenshot Generation

* **Reference-Based Rendering**: Uses source game visual characteristics to guide image generation
* **Mobile Game Aesthetics**: Bright colors, clear UI, readable text, grid layouts
* **Quality Fallbacks**: Placeholder images when generation fails
* **Expandable Lightbox**: Click any screenshot to view full-size with darkened backdrop

### 🎮 Source Game Library

The system draws from 7 meticulously documented mobile puzzle games:

* **Drop Away** (Rollic) - Hole absorption puzzle with colored holes and characters
* **Sky Rush** (Rollic) - Bus evacuation puzzle with passenger boarding
* **Gecko Out** (Rollic) - Snake navigation through irregular mazes
* **Park Match** (Supersonic) - Queue management with FIFO passenger boarding
* **Block Jam** (Voodoo) - Match-3 sorting with sleeping/awake character states
* **Knit Out** (Rollic) - Thread processing with automatic collection mechanics
* **Crowd Express** (Rollic) - Directional traffic puzzle with path blocking

Each game is documented with:

* Template type (Closed Grid, Two-Layer, Three-Layer systems)
* Constraint type (Time-based, Space-based)
* Interaction methods (Tap & Move, Tap only)
* Core mechanics (controllable objects, targets, obstacles)
* Strategic elements and innovation factors

### 🔄 Robust Architecture

* **Retry Logic**: Automatic retries with exponential backoff for AI API calls
* **Rate Limit Handling**: Intelligent delays to avoid quota exhaustion
* **Local Fallbacks**: Deterministic merging when AI services fail
* **Error States**: User-friendly error messages with retry options
* **Loading States**: Elegant skeleton loaders during generation

---

## How It Works

### System Architecture

The application follows a client-server architecture with clear separation of concerns:

```mermaid
graph TD
    subgraph Frontend (React)
        A[Hero Section] --> B(Loading State)
        B --> C[Game Idea Cards]
        D[Source Games Display Section]
        A --> D
    end

    E{HTTP POST /api/generate-ideas}
    E --> F[numberOfIdeas: 1]

    C --> E
    subgraph Backend (Node.js/Express)
        G[Route Handler (routes.ts)]
        G --> H[Game Generation Service]
        H --> I[Game Database (gameDatabase.ts)]
        J[HUGGING FACE INFERENCE API]
        H --> K(Text Generation)
        H --> L(Image Generation)
    end

    E --> G
    G --> H
    H --> I
    H --> J
    J --> K(Flan-T5)
    J --> L(Stable Diffusion)

    style Frontend fill:#f9f,stroke:#333
    style Backend fill:#ccf,stroke:#333
    style J fill:#ddf,stroke:#333

    K --> C
    L --> C


Game Generation Logic
The core generation process follows this intelligent pipeline:

Step 1: Game Selection


// Randomly select 2 distinct games from the database
const a = Math.floor(Math.random() * sourceGames.length);
let b = Math.floor(Math.random() * sourceGames.length);
while (b === a) b = Math.floor(Math.random() * sourceGames.length);
Step 2: Creative Name Generation


// Extract key elements and combine creatively
function generateCreativeName(game1, game2) {
  const g1Words = game1.name.split(" ");
  const g2Words = game2.name.split(" ");

  // Create combinations like "Sky Away", "Hole Rush", etc.
  const combinations = [
    `${g2Words[0]} ${g1Words[g1Words.length - 1]}`,
    `${g1Words[g1Words.length - 1]} ${g2Words[0]}`,
    `${g2Words[0]} to ${g1Words[0]}`,
  ];

  return combinations[Math.floor(Math.random() * combinations.length)];
}
Step 3: AI Text Generation with Structured Prompt
The system sends a carefully crafted prompt to Hugging Face:

You are a creative mobile puzzle game designer. Merge these two games...
GAME 1: Drop Away
Controllable: Colored holes in various shapes
Targets: Colored characters scattered throughout grid
Core: Holes are controllable, absorption on contact...
GAME 2: Sky Rush
Controllable: Colored buses within the grid
Targets: Colored exit gates with passenger queues
Core: Automatic passenger boarding, evacuation mechanics...

CRITICAL REQUIREMENTS:
1. Create a UNIQUE, MEMORABLE game name (like "Hole Rush")
2. The name should be 2-3 words maximum and catchy
3. Keep mechanics grounded in source games only
4. No fantasy, space, or sci-fi themes
Output ONLY valid JSON: { name, coreSetup[], rules[], ... }
Step 4: Response Parsing with Fallback


// Try to parse AI response
let parsed = parseJSONLike(aiResponse);
if (!parsed || missingCriticalFields) {
  // Fall back to deterministic local merge
  ideaBase = mergeLocally(game1, game2);
} else {
  // Use AI-generated idea with validation
  ideaBase = normalizeAndValidate(parsed);
}
Step 5: Local Merge Algorithm (Fallback)
When AI fails, the system uses a deterministic algorithm:



function mergeLocally(game1, game2) {
  // 1. Generate creative name
  const name = generateCreativeName(game1, game2);

  // 2. Combine controllable objects
  const coreSetup = [
    `Primary control: ${game1.controllableObjects}`,
    `Secondary control: ${game2.controllableObjects}`,
    `Primary targets: ${game1.targetObjects}`,
    `Secondary targets: ${game2.targetObjects}`,
    ...game1.uniqueMechanics.slice(0, 3),
    ...game2.uniqueMechanics.slice(0, 3),
  ];

  // 3. Merge rules with constraints
  const rules = [
    `${game1.name} constraint: ${game1.constraintType}`,
    `${game2.name} constraint: ${game2.constraintType}`,
    `Swap control modes on special tiles`,
    `Combine target clearing for bonus`,
  ];

  // 4. Combine objectives from gameplay loops
  const objective = [
    ...game1.coreGameplayLoop,
    ...game2.coreGameplayLoop,
    game1.winCondition,
    game2.winCondition,
  ];

  // 5. Aggregate challenges and obstacles
  const challengeSource = [
    game1.obstacles,
    game2.obstacles,
    "Time and placement constraints",
  ];

  // 6. Identify innovations from unique mechanics
  const innovation = [
    `Use ${game1.uniqueMechanics[0]} to modify ${game2.uniqueMechanics[0]}`,
    `Progressive mix of both games' constraints`,
  ];

  return { name, coreSetup, rules, objective, challengeSource, innovation };
}
Image Generation Pipeline
The image generation process is specifically designed to produce mobile game screenshot quality:

Step 1: Detailed Visual Prompt Construction


const imgPrompt = `
  Mobile puzzle game screenshot for "${gameName}". 

  Quality requirements:
  - High quality, colorful flat design with clear UI
  - Grid-based layout with visible game elements
  - Bright colors, clean sprites, readable text
  - Professional mobile game interface

  Visual inspiration:
  - ${game1.name}: ${game1.controllableObjects}
  - ${game2.name}: ${game2.controllableObjects}

  Screenshot elements:
  - Actual gameplay grid with colored objects
  - Clear HUD elements (timer/score display)
  - Realistic mobile game screenshot quality, NOT concept art

  Style: Bright, vibrant, polished mobile game graphics
  Art direction: Flat 2D sprites, readable UI, modern mobile aesthetic
`;
Step 2: API Call with Retry Logic


async function hfImageGenerate(prompt, maxRetries = 3) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(HF_API_URL, {
        method: 'POST',
        headers: { 
           Authorization: `Bearer ${HF_TOKEN}`,
          Accept: 'image/png' // Prefer binary image response
        },
        body: JSON.stringify({ 
           inputs: prompt,
          options: { wait_for_model: true }
        })
      });

      // Convert to base64 data URL
      const buffer = Buffer.from(await response.arrayBuffer());
      return `data:image/png;base64,${buffer.toString('base64')}`;

    } catch (err) {
      if (err.status === 429) { // Rate limit
        await sleep(1000 * attempt + randomJitter);
        continue;
      }
      if (err.status >= 500) { // Server error
        await sleep(500 * attempt);
        continue;
      }
      throw err; // Unrecoverable error
    }
    attempt++;
  }

  throw new Error("Image generation retries exhausted");
}
Step 3: Fallback to Placeholder


try {
  screenshotUrl = await hfImageGenerate(imgPrompt);
} catch (err) {
  console.warn("Image generation failed – using placeholder");
  screenshotUrl = `https://placehold.co/1024x1024.png?text=${gameName}`;
}
Frontend Interaction Flow
User Clicks Generate Button



// hero-section.tsx
<Button onClick={onGenerate} disabled={isGenerating}>
  {isGenerating ? "Generating Ideas..." : "Generate A Game Idea"}
</Button>
Loading State Activation



// Shows 5 skeleton cards with pulsing animation
<LoadingState />
// Displays: "AI is crafting innovative game concepts..."
API Request



const response = await fetch('/api/generate-ideas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ numberOfIdeas: 1 })
});
const data = await response.json();
// Returns: { ideas: [GeneratedIdea], generatedAt: ISO timestamp }
Render Game Idea Cards



// game-idea-card.tsx
{ideas.map((idea, index) => (
  <GameIdeaCard key={idea.id} idea={idea} index={index} />
))}
Screenshot Lightbox Interaction



// User clicks on screenshot
<div onClick={() => setShowLightbox(true)} className="cursor-pointer">
  <img src={idea.screenshotUrl} alt={idea.name} />
</div>

// Lightbox modal appears
{showLightbox && (
  <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
    <img src={idea.screenshotUrl} className="max-w-7xl max-h-[90vh]" />
    <button onClick={() => setShowLightbox(false)}>Close</button>
  </div>
)}
Tech Stack
Frontend
React 18: Modern UI library with hooks and concurrent features

TypeScript 5: Type-safe development with advanced generics

Tailwind CSS 3: Utility-first styling with custom design system

Wouter: Lightweight routing (~1.5KB)

TanStack Query: Powerful async state management

Lucide React: Beautiful, consistent icon set

Shadcn/ui: Accessible, customizable component primitives

Backend
Node.js 18+: JavaScript runtime with ES modules

Express 4: Fast, minimalist web framework

TypeScript: End-to-end type safety

Zod: Runtime schema validation

AI & ML
Hugging Face Inference API:

Text generation: `google/flan-t5-small` (or configurable)

Image generation: `stabilityai/stable-diffusion-2-1` (or configurable)

Fallback algorithms: Local deterministic merging when AI unavailable

Development Tools
Vite 5: Lightning-fast dev server and build tool

ESLint: Code quality and consistency

PostCSS: CSS transformations

dotenv: Environment variable management

Folder Structure
/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                  # Base UI primitives (shadcn)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   └── toast.tsx
│   │   │   ├── error-state.tsx      # Error display with retry
│   │   │   ├── game-idea-card.tsx   # Individual game idea display
│   │   │   ├── hero-section.tsx     # Landing hero with CTA
│   │   │   ├── loading-state.tsx    # Skeleton loaders
│   │   │   ├── source-games-section.tsx  # Source game gallery
│   │   │   └── theme-provider.tsx   # Dark/light theme context
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── use-mobile.tsx       # Responsive breakpoint detection
│   │   │   └── use-toast.ts         # Toast notification system
│   │   ├── lib/                     # Utility libraries
│   │   │   ├── queryClient.ts       # TanStack Query config
│   │   │   └── utils.ts             # Helper functions
│   │   ├── pages/                   # Route pages
│   │   │   ├── home.tsx             # Main application page
│   │   │   └── not-found.tsx        # 404 page
│   │   ├── App.tsx                  # Root component with routing
│   │   ├── main.tsx                 # Application entry point
│   │   └── index.css                # Global styles + Tailwind
│   └── index.html                   # HTML template
├── server/                          # Backend Node.js application
│   ├── config.ts                    # Environment configuration
│   ├── gameDatabase.ts              # 7 source games documentation
│   ├── openaiService.ts             # AI generation logic (HuggingFace)
│   ├── routes.ts                    # API endpoint definitions
│   ├── storage.ts                   # In-memory data storage
│   ├── vite.ts                      # Vite dev server integration
│   └── index.ts                     # Express server entry point
├── shared/                          # Shared types between client/server
│   └── schema.ts                    # TypeScript interfaces & Zod schemas
├── .env                             # Environment variables (gitignored)
├── .env.example                     # Environment template
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── vite.config.ts                   # Vite build configuration
└── README.md                        # This file
Getting Started
Prerequisites
Ensure you have the following installed:

Node.js v18.0.0 or later (Download)

npm v9.0.0 or later (comes with Node.js)

Hugging Face Account (Sign up)

Environment Setup
Create a Hugging Face API Token:

Go to Hugging Face Settings → Access Tokens

Create a new token with read access

Copy the token (starts with hf_...)

Configure Environment Variables:

Create a .env file in the project root:

Bash

cp .env.example .env
Edit .env and add your tokens:

Bash

# Required: Hugging Face API token
HUGGINGFACE_API_TOKEN=hf_your_token_here

# Optional: Custom model selections
HUGGINGFACE_TEXT_MODEL=google/flan-t5-small
HUGGINGFACE_IMAGE_MODEL=stabilityai/stable-diffusion-2-1

# Optional: Server configuration
PORT=5000
NODE_ENV=development
Installation
Clone the repository:

Bash

git clone [https://github.com/yourusername/ai-game-ideation-agent.git](https://github.com/yourusername/ai-game-ideation-agent.git)
cd ai-game-ideation-agent
Install dependencies:

Bash

npm install
Start the development server:

Bash

npm run dev
Open your browser:

http://localhost:5000
The application will start with:

Backend API running on http://localhost:5000/api

Frontend served via Vite HMR on http://localhost:5000

Available Scripts
Development
Bash

npm run dev
Starts both the Express backend and Vite dev server concurrently.

Backend runs with hot-reload using tsx

Frontend runs with HMR (Hot Module Replacement)

Access the app at http://localhost:5000

Production Build
Bash

npm run build
Creates an optimized production build:

Compiles TypeScript backend to dist/

Builds frontend assets to dist/public/

Output is ready for deployment

Production Start
Bash

npm start
Runs the production build. Make sure to run npm run build first.

Type Checking
Bash

npm run check
Runs TypeScript compiler in no-emit mode to check for type errors without building.

Component Documentation
GameIdeaCard
The core component for displaying generated game ideas with expandable screenshots.

Features:

Screenshot Lightbox: Click to expand image with darkened backdrop

Structured Information: Displays core setup, rules, objectives, challenges, and innovations

Source Attribution: Shows which games inspired the idea

Hover Effects: Smooth transitions and visual feedback

Responsive Design: Adapts to mobile, tablet, and desktop

Usage:

TypeScript

import { GameIdeaCard } from '@/components/game-idea-card';
import type { GeneratedIdea } from '@shared/schema';

const idea: GeneratedIdea = {
  id: 'uuid',
  name: 'Hole Rush',
  inspiredFrom: ['Sky Rush', 'Drop Away'],
  screenshotUrl: 'data:image/png;base64,...',
  coreSetup: ['...'],
  rules: ['...'],
  objective: ['...'],
  challengeSource: ['...'],
  innovation: ['...']
};

<GameIdeaCard idea={idea} index={0} />
Lightbox Interaction:

TypeScript

// Internal state management
const [showLightbox, setShowLightbox] = useState(false);

// Click handler on screenshot
<div onClick={() => setShowLightbox(true)}>
  <img src={idea.screenshotUrl} alt={idea.name} />
</div>

// Modal with backdrop
{showLightbox && (
  <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
    <img src={idea.screenshotUrl} className="max-w-7xl" />
    <button onClick={() => setShowLightbox(false)}>×</button>
  </div>
)}
HeroSection
The landing section with call-to-action button.

Props:

TypeScript

interface HeroSectionProps {
  onGenerate: () => void;      // Callback when generate button clicked
  isGenerating: boolean;        // Show loading state
}
Features:

Animated Background: Subtle grid pattern

Feature Highlights: 7 source games, AI-powered, professional screenshots

Loading State: Button shows spinner and disabled state during generation

Responsive Typography: Scales from mobile to desktop

LoadingState
Displays skeleton loaders during idea generation.

Features:

5 Skeleton Cards: Matches final card layout

Pulsing Animation: Smooth loading indicators

Status Message: Shows generation progress text

ErrorState
Displays errors with retry functionality.

Props:

TypeScript

interface ErrorStateProps {
  error: string;                // Error message to display
  onRetry: () => void;          // Callback for retry button
}
SourceGamesSection
Gallery displaying all 7 source games.

Props:

TypeScript

interface SourceGamesSectionProps {
  games: SourceGame[];          // Array of source game data
}
Features:

Grid Layout: Responsive 1/2/3 column layout

Game Cards: Screenshot, metadata, badges

Constraint Badges: Color-coded time/space constraints

API Documentation
GET /api/source-games
Returns the complete database of source games.

Response:

JSON

[
  {
    "id": "drop-away",
    "name": "Drop Away",
    "developer": "Rollic",
    "templateType": "Template 1 (Closed Grid)",
    "constraintType": "Time-based",
    "interactionMethod": "Tap & Move",
    "puzzleCategory": "Hole absorption puzzle",
    "screenshotUrl": "https://...",
    "mechanics": {
      "controllableObjects": "Colored holes in various shapes",
      "targetObjects": "Colored characters scattered throughout grid",
      "obstacles": "Other holes and characters that block movement"
    },
    "coreGameplayLoop": ["...", "..."],
    "winCondition": "...",
    "loseCondition": "...",
    "strategicElements": ["...", "..."],
    "innovationElements": ["...", "..."],
    "uniqueMechanics": ["...", "..."]
  },
  // ... 6 more games
]
POST /api/generate-ideas
Generates new game ideas by merging source games.

Request Body:

JSON

{
  "numberOfIdeas": 1
}
Validation (via Zod):

TypeScript

{
  numberOfIdeas: z.number().int().min(1).max(1)  // Capped at 1 to avoid quota issues
}
Response:

JSON

{
  "ideas": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Hole Rush",
      "inspiredFrom": ["Sky Rush", "Drop Away"],
      "screenshotUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUh...",
      "coreSetup": [
        "Closed grid with multiple exit points",
        "Queues of colored characters outside each exit",
        "Colored holes inside grid instead of buses"
      ],
      "rules": [
        "Each hole only absorbs matching colored characters",
        "Characters drop into holes when queue reaches them",
        "Holes cannot overlap or block each other"
      ],
      "objective": [
        "Clear all outside queues within time limit",
        "Strategic hole positioning required"
      ],
      "challengeSource": [
        "Managing hole shapes in crowded grid",
        "Balancing multiple simultaneous queues",
        "Time pressure"
      ],
      "innovation": [
        "Swap outside queues of people with holes",
        "Character absorption creates satisfying animation"
      ]
    }
  ],
  "generatedAt": "2025-10-18T10:30:45.123Z"
}
Error Response:

JSON

{
  "error": "Failed to generate ideas: HuggingFace API rate limit exceeded"
}
Project Constraints & Design Decisions
Why Limit to 1 Idea Per Generation?
Rate Limiting: Hugging Face free tier has strict quotas. Generating multiple ideas rapidly exhausts:

Text generation API calls

Image generation API calls (most expensive)

Solution: Cap at 1 idea with clear UX feedback. Users can click "Generate" multiple times.

Why Local Fallback Merging?
Reliability: AI APIs can fail due to:

Rate limits (429 errors)

Server errors (500+ errors)

Network timeouts

Invalid responses

Solution: Deterministic mergeLocally() function ensures 100% success rate for idea generation, even when AI is unavailable. Only screenshots might be placeholders.

Why Hugging Face vs OpenAI/Replicate?
Cost: Hugging Face Inference API is free tier friendly

Flexibility: Can swap models via environment variables

Control: Direct API access without SDK lock-in

Why Not Use localStorage for State?
Artifacts Restriction: Claude artifacts don't support browser storage APIs. All state must be in-memory (React state). (Note: This specific constraint may be due to a specific environment not mentioned, but is retained as a design decision.)

Why Dark Theme Default?
Visual Hierarchy: Dark backgrounds make colorful game screenshots pop

Reduced Eye Strain: Better for prolonged ideation sessions

Modern Aesthetic: Aligns with game development tools (Unity, Unreal dark themes)