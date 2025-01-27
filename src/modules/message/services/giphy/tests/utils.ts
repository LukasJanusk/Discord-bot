import { expect } from 'vitest';
import type { Insertable } from 'kysely';
import { Gif } from '@/database';

export const fakeGif = (
  overrides: Partial<Insertable<Gif>> = {},
): Insertable<Gif> => ({
  apiId: null,
  height: null,
  url: 'fake_url',
  width: null,

  ...overrides,
});

export const gifMatcher = (overrides: Partial<Insertable<Gif>> = {}) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeGif(overrides),
});

export const fakeGifFull = (overrides: Partial<Insertable<Gif>> = {}) => ({
  id: 2,
  ...fakeGif(overrides),
});

export const mockApiResponse = {
  data: {
    id: '12345',
    url: 'https://giphy.com/gifs/example-url',
    images: {
      original: {
        url: 'https://media.giphy.com/media/example-url/giphy.gif',
        width: '500',
        height: '300',
        size: '150000',
      },
    },
  },
};
export const mockBadApiResponse = {
  data: {
    id: undefined,
    url: undefined,
    images: {
      original: {
        width: undefined,
      },
    },
  },
};

export const parsedResponseData = {
  data: {
    id: '12345',
    images: {
      original: {
        url: 'https://media.giphy.com/media/example-url/giphy.gif',
        width: '500',
        height: '300',
      },
    },
  },
};
export const parsedGif = {
  apiId: '12345',
  url: 'https://media.giphy.com/media/example-url/giphy.gif',
  width: 500,
  height: 300,
};
