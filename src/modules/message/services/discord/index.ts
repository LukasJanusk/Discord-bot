/* eslint-disable no-console */
import { Client, GuildMember, TextChannel, User } from 'discord.js';
import {
  setupClient,
  createAttachment,
  buildEmbed,
  findMember,
  getChannel,
} from './utils';
import { ParsedGif } from '../giphy/schema';
import { UserNotFound } from '../../errors';

export interface DiscordBot {
  client: Client;
  channel: TextChannel;
  /**
   * Finds a User in TextChannel based on provided username.
   * @param userName - The username to mention in the message.
   * @returns A promise that resolves to User class object.
   * @throws An error if the user was not Found.
   */
  getUser: (username: string) => Promise<User | GuildMember>;
  /**
   * Sends a message to a guild text channel.
   * @param message - The message content to send.
   * @param gifImage - The object containing gifUrl.
   * @returns A promise that resolves to the sent message in the channel.
   * @throws An error if the message could not be sent.
   */
  sendToChannel: (message: string, gifImage?: ParsedGif) => Promise<boolean>;
}

export default async function createDiscordBot(
  token: string,
  channelId: string,
): Promise<DiscordBot> {
  const client = await setupClient(token);
  const channel = getChannel(client, channelId);

  const getUser = async (userName: string): Promise<User | GuildMember> => {
    const user = await findMember(channel, userName);
    return user;
  };
  const sendToChannel = async (
    message: string,
    gifImage?: ParsedGif,
  ): Promise<boolean> => {
    try {
      const embed = buildEmbed(gifImage);
      const attachments = createAttachment(gifImage);

      await channel.send({
        content: message,
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
      if (error instanceof UserNotFound) throw error;
      return false;
    }
  };

  return { sendToChannel, getUser, client, channel };
}
