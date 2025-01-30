import { it, vi, expect } from 'vitest';
import { Client, GatewayIntentBits, GuildMember, User } from 'discord.js';
import createDiscordBot from '../index';
import { setupClient } from '../utils';

vi.mock('../utils', () => ({
  setupClient: vi.fn(),
  formatMessage: vi.fn().mockReturnValue('formatted message'),
  getChannel: vi.fn(),
  createAttachment: vi.fn().mockReturnValue([]),
  buildEmbed: vi.fn().mockReturnValue(null),
  findMember: vi.fn().mockResolvedValue({
    user: { username: 'mockedUser' } as User,
  } as GuildMember),
}));

it('throws an error when it fails to create discord client', async () => {
  const token = 'some_string';
  const channelId = 'some_string';

  const errorMessage = 'An invalid token was provided.';
  // @ts-ignore
  (setupClient as vi.Mock).mockRejectedValue(new Error(errorMessage));

  await expect(createDiscordBot(token, channelId)).rejects.toThrow(
    /An invalid token was provided./i,
  );
});

it('returns false when message failed to be sent', async () => {
  const token = 'valid_token';
  const channelId = 'valid_channel_id';
  // @ts-ignore
  (setupClient as vi.Mock).mockResolvedValueOnce(
    new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
    }),
  );

  const bot = await createDiscordBot(token, channelId);
  expect(await bot.sendToChannel('Hello', 'mockedUser')).toEqual(false);
});
