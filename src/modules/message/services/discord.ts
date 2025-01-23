/* eslint-disable no-console */
import {
  Client,
  GatewayIntentBits,
  TextChannel,
  Message,
  EmbedBuilder,
} from 'discord.js';
import { ParsedGif } from './parser';

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
    gifImage?: ParsedGif,
    userName?: string,
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

export default async function createDiscordBot(
  token: string,
  channelId: string,
): Promise<DiscordBot> {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
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
    gifImage?: ParsedGif,
    userName?: string,
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
        if (user) {
          formattedMessage = `<@${user.id}> ${message}`;
        } else {
          console.warn(`User with username ${userName} not found.`);
        }
      }
      const embed = gifImage
        ? new EmbedBuilder()
            .setTitle('Congratulations!')
            .setImage(gifImage.gifUrl)
            .setDescription(
              `Dimensions: ${gifImage.width} x ${gifImage.height}`,
            )
        : null;

      const sent = await channel.send({
        content: formattedMessage,
        embeds: embed ? [embed] : [],
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

      const embed = gifImage
        ? new EmbedBuilder()
            .setTitle('Congratulations!')
            .setImage(gifImage.gifUrl)
            .setDescription(
              `Dimensions: ${gifImage.width} x ${gifImage.height}`,
            )
        : null;
      const sent = await user.send({
        content: message,
        embeds: embed ? [embed] : [],
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
