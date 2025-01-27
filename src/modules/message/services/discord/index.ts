/* eslint-disable no-console */
import {
  Client,
  GatewayIntentBits,
  TextChannel,
  EmbedBuilder,
  GuildMember,
} from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { getCurrentDir } from '@/utils/directory';
import { ParsedGif } from '../giphy/schema';
import { UserNotFound } from '../../errors';

export interface DiscordBot {
  client: Client;
  /**
   * Sends a message to a guild text channel.
   * @param message - The message content to send.
   * @param userName - (Optional) The username to mention in the message.
   * @param gifImage - The object containing gifUrl, width, height.
   * @returns A promise that resolves to the sent message in the channel.
   * @throws An error if the message could not be sent.
   */
  sendToChannel: (
    message: string,
    userName: string,
    gifImage?: ParsedGif,
  ) => Promise<boolean>;
  /**
   * Sends a direct message to a user.
   * @param userId - The Discord ID of the recipient.
   * @param message - The message content to send.
   * @param gifImage - The object containing gifUrl, width, height.
   * @returns A promise that resolves to the sent direct message.
   * @throws An error if the message could not be sent.
   */
  sendDM: (
    userId: string,
    message: string,
    gifImage?: ParsedGif,
  ) => Promise<boolean>;
}

const setupClient = async (token: string): Promise<Client> => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
    ],
  });

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

export const formatMessage = async (
  channel: TextChannel,
  message: string,
  userName?: string,
): Promise<string> => {
  if (userName) {
    const user = await findMember(channel, userName);
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

export default async function createDiscordBot(
  token: string,
  channelId: string,
): Promise<DiscordBot> {
  const client = await setupClient(token);

  const sendToChannel = async (
    message: string,
    userName: string,
    gifImage?: ParsedGif,
  ) => {
    const channel = client.channels.cache.get(channelId);
    if (!channel || !(channel instanceof TextChannel)) {
      console.error('Invalid or non-existent text channel');
      return false;
    }

    try {
      const formattedMessage = await formatMessage(channel, message, userName);
      const embed = buildEmbed(gifImage);
      const attachments = createAttachment(gifImage);

      await channel.send({
        content: formattedMessage,
        embeds: embed ? [embed] : [],
        files: attachments,
      });
      return true;
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : 'Failed to send message to channel',
      );
      return false;
    }
  };

  const sendDM = async (
    userId: string,
    message: string,
    gifImage?: ParsedGif,
  ) => {
    try {
      const user = await client.users.fetch(userId);
      if (!user) {
        console.error('User not found');
        return false;
      }

      const embed = buildEmbed(gifImage);
      const attachments = createAttachment(gifImage);
      await user.send({
        content: message,
        embeds: embed ? [embed] : [],
        files: attachments.length > 0 ? attachments : [],
      });
      return true;
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : 'Failed to send DM',
      );
      return false;
    }
  };

  return { sendToChannel, sendDM, client };
}
