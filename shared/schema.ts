import { z } from "zod";

// Source game data structure
export const sourceGameSchema = z.object({
  id: z.string(),
  name: z.string(),
  developer: z.string(),
  templateType: z.enum(["Template 1 (Closed Grid)", "Template 2 (Two-Layer System)", "Template 3 (Three-Layer System)"]),
  constraintType: z.enum(["Time-based", "Space-based"]),
  interactionMethod: z.string(),
  puzzleCategory: z.string(),
  screenshotUrl: z.string(),
  mechanics: z.object({
    controllableObjects: z.string(),
    targetObjects: z.string(),
    obstacles: z.string().optional(),
  }),
  coreGameplayLoop: z.array(z.string()),
  winCondition: z.string(),
  loseCondition: z.string(),
  strategicElements: z.array(z.string()),
  innovationElements: z.array(z.string()),
  uniqueMechanics: z.array(z.string()),
});

export type SourceGame = z.infer<typeof sourceGameSchema>;

// Generated game idea structure
export const generatedIdeaSchema = z.object({
  id: z.string(),
  name: z.string(),
  inspiredFrom: z.array(z.string()), // Array of 2 game names
  coreSetup: z.array(z.string()),
  rules: z.array(z.string()),
  objective: z.array(z.string()),
  challengeSource: z.array(z.string()),
  innovation: z.array(z.string()),
  screenshotUrl: z.string().optional(), // Generated screenshot URL
});

export type GeneratedIdea = z.infer<typeof generatedIdeaSchema>;

// Request to generate ideas
export const generateIdeasRequestSchema = z.object({
  numberOfIdeas: z.number().min(1).max(10).default(5),
});

export type GenerateIdeasRequest = z.infer<typeof generateIdeasRequestSchema>;

// Response with generated ideas
export const generateIdeasResponseSchema = z.object({
  ideas: z.array(generatedIdeaSchema),
  generatedAt: z.string(),
});

export type GenerateIdeasResponse = z.infer<typeof generateIdeasResponseSchema>;
