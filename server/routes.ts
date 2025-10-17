import type { Express } from "express";
import { createServer, type Server } from "http";
import { sourceGamesDatabase } from "./gameDatabase";
import { generateGameIdeas } from "./openaiService";
import { generateIdeasRequestSchema, type GenerateIdeasResponse } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all source games
  app.get("/api/source-games", async (_req, res) => {
    try {
      res.json(sourceGamesDatabase);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate game ideas
  app.post("/api/generate-ideas", async (req, res) => {
    try {
      const validated = generateIdeasRequestSchema.parse(req.body);
      
      const ideas = await generateGameIdeas(sourceGamesDatabase, validated.numberOfIdeas);
      
      const response: GenerateIdeasResponse = {
        ideas,
        generatedAt: new Date().toISOString(),
      };
      
      res.json(response);
    } catch (error: any) {
      console.error("Error generating ideas:", error);
      res.status(500).json({ error: error.message || "Failed to generate ideas" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
