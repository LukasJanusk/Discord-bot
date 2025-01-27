import { it, expect, describe } from 'vitest';
import { omit } from 'lodash';
import { parseGifData, parseGif } from '../schema';
import {
  mockApiResponse,
  mockBadApiResponse,
  parsedResponseData,
  parsedGif,
} from './utils';

describe('parse Api response', () => {
  it('returns GiphyApiResponse object', async () => {
    const parsed = parseGifData(mockApiResponse);

    expect(parsed).toEqual(
      omit(mockApiResponse, ['data.images.original.size', 'data.url']),
    );
  });
  it('throws an error when receives wrong response data', async () => {
    expect(() => parseGifData(mockBadApiResponse)).toThrowError(
      /Failed to parse GIF data/,
    );
  });
});

describe('parse Api response to ParsedGif', () => {
  it('returns ParsedGif', async () => {
    const parsed = parseGif(parsedResponseData);

    expect(parsed).toEqual(parsedGif);
  });
});
