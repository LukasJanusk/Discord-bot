import dotenv from 'dotenv';

dotenv.config();

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
}

export const DISCORD_BOT_TOKEN = getEnvVar('DISCORD_BOT_TOKEN');
export const CHANNEL_ID = getEnvVar('CHANNEL_ID');
export const DATABASE_URL = getEnvVar('DATABASE_URL');
export const GIPHY_API_KEY = getEnvVar('GIPHY_API_KEY');
