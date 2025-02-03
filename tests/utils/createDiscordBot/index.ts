/* eslint-disable no-console */
import { Client, GuildMember, TextChannel } from 'discord.js';
import { DiscordBot } from '@/modules/message/services/discord';
import { ParsedGif } from '@/modules/message/services/giphy/schema';

const mockUser = {
  user: {
    username: 'someUsername',
    id: 'fakeUserId',
    displayName: 'fakeUserId',
  },
} as GuildMember;

const mockChannel = {
  guild: {
    members: {
      fetch: async () =>
        new Map<string, GuildMember>().set('fakeUserId', mockUser),
    },
  },
} as unknown as TextChannel;

export default (): DiscordBot => {
  const client = {} as Client;
  const channel = mockChannel;

  const sendToChannel = async (
    message: string,
    gifImage?: ParsedGif,
  ): Promise<boolean> => {
    console.log('sendToChannel called with message:', message);
    console.log('gifImage:', gifImage);
    return true;
  };

  const getUser = async () => {
    console.log(`getUser called with`, mockUser.user);
    return mockUser.user;
  };

  return { client, sendToChannel, getUser, channel };
};
