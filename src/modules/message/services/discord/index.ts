/* eslint-disable no-console */
import { Client } from 'discord.js';
import {
  formatMessage,
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
}

export default async function createDiscordBot(
  token: string,
  channelId: string,
): Promise<DiscordBot> {
  const client = await setupClient(token);

  const sendToChannel = async (
    message: string,
    userName: string,
    gifImage?: ParsedGif,
  ): Promise<boolean> => {
    const channel = getChannel(client, channelId);
    try {
      const user = await findMember(channel, userName);
      const formattedMessage = formatMessage(message, user);
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
      if (error instanceof UserNotFound) throw error;
      return false;
    }
  };

  return { sendToChannel, client };
}
