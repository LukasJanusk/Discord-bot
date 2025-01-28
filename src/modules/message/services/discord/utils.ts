/* eslint-disable no-console */
import {
  Client,
  GatewayIntentBits,
  TextChannel,
  EmbedBuilder,
  GuildMember,
  User,
} from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import type { ParsedGif } from '../giphy/schema';
import { getCurrentDir } from '@/utils/directory';
import { UserNotFound } from '../../errors';

export const setupClient = async (token: string): Promise<Client> => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
    ],
  });

  try {
    await client.login(token);

    await new Promise<void>((resolve, reject) => {
      client.once('ready', () => {
        console.log('Bot is ready!');
        resolve();
      });
      client.once('error', (error) => {
        console.error('An error occurred:', error);
        reject(error);
      });
    });

    return client;
  } catch (error) {
    console.error('Failed to set up client:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to set up client: ${error.message}`
        : `Failed to set up client: unknown error occured`,
    );
  }
};

export const findMember = async (
  channel: TextChannel,
  userName: string,
): Promise<GuildMember> => {
  const members = await channel.guild.members.fetch();
  const user = members.find((member) => member.user.username === userName);

  if (!user) {
    throw new UserNotFound();
  }

  return user;
};

export const formatMessage = (
  message: string,
  user?: User | GuildMember,
): string => {
  if (user) {
    return `<@${user.id}> ${message}`;
  }
  return message;
};

export const buildEmbed = (gifImage?: ParsedGif) => {
  if (!gifImage) return null;

  return new EmbedBuilder()
    .setTitle('Congratulations!')
    .setImage(gifImage.url)
    .setDescription(`Dimensions: ${gifImage.width} x ${gifImage.height}`);
};

export const createAttachment = (gifImage?: ParsedGif) => {
  const attachments = [];
  if (!gifImage) {
    const randomNumber = Math.floor(Math.random() * 4) + 1;
    const currentDir = getCurrentDir(import.meta.url);
    const localGifPath = path.resolve(
      currentDir,
      `./assets/${randomNumber}.gif`,
    );
    if (fs.existsSync(localGifPath)) {
      attachments.push({
        attachment: localGifPath,
        name: 'congratulation.gif',
        title: 'Congratulations!',
      });
    }
  }
  return attachments;
};
