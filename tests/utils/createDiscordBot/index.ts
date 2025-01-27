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
  ): Promise<boolean> => {
    console.log('sendToChannel called with message:', message);
    console.log('userName:', userName);
    console.log('gifImage:', gifImage);

    return true;
  };

  const sendDM = async (
    userId: string,
    message: string,
    gifImage?: ParsedGif,
  ): Promise<boolean> => {
    console.log('sendDM called with userId:', userId);
    console.log('message:', message);
    console.log('gifImage:', gifImage);

    return true;
  };

  return { client, sendToChannel, sendDM };
};
