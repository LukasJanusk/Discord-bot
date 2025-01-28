import { it, expect, describe } from 'vitest';
import { omit } from 'lodash';
import { parseGifData, parseGif, parseInsertable } from '../schema';
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
describe('parseInsertable', () => {
  it('parses when null values in data', () => {
    const record = {
      apiId: 'id123',
      url: 'url.example.com',
      height: null,
      width: null,
    };
    expect(parseInsertable(record)).toEqual({
      apiId: 'id123',
      url: 'url.example.com',
      height: null,
      width: null,
    });
  });
  it('parses when missing values in data', () => {
    const record = {
      url: 'url.example.com',
    };
    expect(parseInsertable(record)).toEqual({
      apiId: null,
      url: 'url.example.com',
      height: null,
      width: null,
    });
  });
});
