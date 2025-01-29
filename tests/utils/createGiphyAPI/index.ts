/* eslint-disable @typescript-eslint/no-unused-vars */
import { ParsedGif } from '../../../src/modules/message/services/giphy/schema';
import { GifAPI } from '@/modules/message/services/giphy';

export const createGiphyAPIBadReturn = (_fake_key: string): GifAPI => {
  const fetchGIF = async (tag: string): Promise<ParsedGif | null> => null;

  return { fetchGIF };
};

export const createGiphyAPIGoodReturn = (fake_key: string): GifAPI => {
  const fetchGIF = async (tag: string): Promise<ParsedGif | null> => ({
    apiId: 'someApiId',
    width: 100,
    height: 200,
    url: 'www.example.url',
  });

  return { fetchGIF };
};
