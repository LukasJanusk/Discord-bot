import { expect, it, describe, vi } from 'vitest';
import {
  Collection,
  TextChannel,
  GuildMember,
  User,
  EmbedBuilder,
  GatewayIntentBits,
} from 'discord.js';
import fs from 'fs';
import {
  formatMessage,
  findMember,
  buildEmbed,
  createAttachment,
  setupClient,
} from '../utils';
import { UserNotFound } from '../../../errors';
import { ParsedGif } from '../../giphy/schema';

describe('findMember', () => {
  it('throws error when username not found', async () => {
    const mockMembers = new Collection<string, GuildMember>();
    const mockChannel = {
      guild: {
        members: {
          fetch: vi.fn().mockResolvedValue(mockMembers),
        },
      },
    } as unknown as TextChannel;
    await expect(findMember(mockChannel, 'someUsername')).rejects.toThrowError(
      new UserNotFound('Username not found'),
    );
  });
  it('returns found user', async () => {
    const mockUser = { username: 'foundUsername', id: 'userId123' } as User;

    const mockGuildMember = { user: mockUser } as GuildMember;

    const mockMembers = new Collection<string, GuildMember>();
    mockMembers.set('foundUsername', mockGuildMember);
    const mockChannelWithUser = {
      guild: {
        members: {
          fetch: vi.fn().mockResolvedValue(mockMembers),
        },
      },
    } as unknown as TextChannel;

    const member = await findMember(mockChannelWithUser, 'foundUsername');
    expect(member).toEqual({
      user: {
        username: 'foundUsername',
        id: 'userId123',
      },
    });
  });
});

describe('formatMessage', () => {
  it('formats message when user is provided', () => {
    const mockUser = { username: 'foundUsername', id: 'userId123' } as User;
    const message = formatMessage('You did it!', mockUser);
    expect(message).toEqual('<@userId123> You did it!');
  });
  it('returns original message if no user is provided', () => {
    const message = formatMessage('You did it!');
    expect(message).toEqual('You did it!');
  });
});
describe('buildEmbed', () => {
  it('returns embed when FormatedGif is provided', () => {
    const mockGif = {
      apiId: 'someId123',
      url: 'https://example.com/gif.gif',
      width: 100,
      height: 100,
    };
    const result = buildEmbed(mockGif);

    expect(result).toBeInstanceOf(EmbedBuilder);
    expect(result?.data.title).toBe('Congratulations!');
    expect(result?.data.image?.url).toBe(mockGif.url);
    expect(result?.data.description).toBe(
      `Dimensions: ${mockGif.width} x ${mockGif.height}`,
    );
  });
  it('returns null when FormatedGif is not provided', () => {
    expect(buildEmbed()).toEqual(null);
  });
});
describe('createAttachment', () => {
  it('returns empty array when ParsedGif is passed', () => {
    const gif = {} as ParsedGif;
    expect(createAttachment(gif).length).toEqual(0);
  });
  it('returns attachment from locally stored gif image', () => {
    vi.mock('fs');
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    // @ts-ignore
    fs.existsSync.mockReturnValue(true);

    const attachments = createAttachment();
    expect(attachments.length).toBe(1);
  });
});
describe('setupClient', async () => {
  it.skip('succesfully returns created client', async () => {
    vi.doMock('discord.js', () => ({
      Client: vi.fn().mockImplementation(() => ({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.DirectMessages,
        ],
        login: vi.fn().mockResolvedValue('encrypted-token-string'),
        once: vi.fn(),
      })),
      GatewayIntentBits: {
        Guilds: 'GUILD',
        GuildMessages: 'GUILD_MESSAGES',
        GuildMembers: 'GUILD_MEMBERS',
        MessageContent: 'MESSAGE_CONTENT',
        DirectMessages: 'DIRECT_MESSAGES',
      },
    }));
    const token = 'valid-token';
    const client = await setupClient(token);

    expect(client.login).toHaveBeenCalledWith(token);
  });
  it('throws error when fails to create client', async () => {
    const fakeToken = 'fake_token';
    await expect(setupClient(fakeToken)).rejects.toThrow(
      /Failed to set up client/i,
    );
  });
});
