import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

// Check for required environment variables
const requiredEnvVars = ['OPENAI_API_KEY', 'REPLICATE_API_TOKEN'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`WARNING: ${envVar} is not set. Some features may not work.`);
  }
}

export const CONFIG = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
} as const;