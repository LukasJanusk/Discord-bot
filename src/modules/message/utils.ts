import { ParsedGif, parseInsertable } from './services/giphy/schema';
import type { RowSelect } from './services/giphy/repository';
import pickRandom from '@/utils/random';

export const getLocalGif = async (
  getGifs: () => Promise<RowSelect[]>,
): Promise<ParsedGif> => {
  const gifs = await getGifs();
  const gif = pickRandom(gifs);
  return parseInsertable(gif);
};
