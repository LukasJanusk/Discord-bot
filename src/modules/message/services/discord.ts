/* eslint-disable no-console */
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

export interface DiscordBot {
  client: Client;
  send: (message: string) => Promise<void>;
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

  const send = async (message: string) => {
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      console.error('Channel not found');
      throw new Error('Channel not found');
    }
    if (!(channel instanceof TextChannel)) {
      throw new Error('The channel is not a text-based channel');
    }

    try {
      await channel.send(message);
      console.log('Message sent:', message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return {
    send,
    client,
  };
}
