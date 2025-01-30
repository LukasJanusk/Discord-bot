/* eslint-disable no-console */
import { Client } from 'discord.js';
import { DiscordBot } from '@/modules/message/services/discord';
import { ParsedGif } from '@/modules/message/services/giphy/schema';

export default (): DiscordBot => {
  const client = {} as Client;
  const sendToChannel = async (
    message: string,
    userName: string,
    gifImage?: ParsedGif,
  ): Promise<boolean> => true;

  return { client, sendToChannel };
};
