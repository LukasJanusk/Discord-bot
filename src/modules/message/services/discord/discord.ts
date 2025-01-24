/* eslint-disable no-console */
import {
  Client,
  GatewayIntentBits,
  TextChannel,
  Message,
  EmbedBuilder,
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
  ) => Promise<Message<true>>;

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
  ) => Promise<Message<false>>;
}

// Function to build the embed
const buildEmbed = (gifImage?: ParsedGif) => {
  if (!gifImage) return null;

  return new EmbedBuilder()
    .setTitle('Congratulations!')
    .setImage(gifImage.url)
    .setDescription(`Dimensions: ${gifImage.width} x ${gifImage.height}`);
};

// Function to create an attachment (with local gif fallback)
const createAttachment = (gifImage?: ParsedGif) => {
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

  const sendToChannel = async (
    message: string,
    userName: string,
    gifImage?: ParsedGif,
  ) => {
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      console.error('Channel not found');
      throw new Error('Channel not found');
    }
    if (!(channel instanceof TextChannel)) {
      throw new Error('The channel is not a text-based channel');
    }

    try {
      let formattedMessage = message;
      if (userName) {
        const members = await channel.guild.members.fetch();
        const user = members.find(
          (member) => member.user.username === userName,
        );
        console.log(user);
        if (user) {
          formattedMessage = `<@${user.id}> ${message}`;
        } else {
          throw new UserNotFound();
        }
      }
      const embed = buildEmbed(gifImage);
      const attachments = createAttachment(gifImage);

      const sent = await channel.send({
        content: formattedMessage,
        embeds: embed ? [embed] : [],
        files: attachments,
      });

      return sent;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed send Channel message: Unknown error',
      );
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
        throw new Error('User not found');
      }

      const embed = buildEmbed(gifImage);
      const attachments = createAttachment(gifImage);
      const sent = await user.send({
        content: message,
        embeds: embed ? [embed] : [],
        files: attachments.length > 0 ? attachments : [],
      });

      return sent;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed send DM: Unknown error',
      );
    }
  };

  return {
    sendToChannel,
    sendDM,
    client,
  };
}
