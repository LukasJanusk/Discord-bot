import { z } from 'zod';
import type { Gif } from '@/database';

type Record = Gif;

const schema = z.object({
  id: z.coerce.number().int().positive(),
  apiId: z.preprocess(
    (val) => (val == null ? null : val),
    z.string().nullable(),
  ),
  url: z.string(),
  width: z.preprocess(
    (val) => (val == null ? null : val),
    z.coerce.number().nullable(),
  ),
  height: z.preprocess(
    (val) => (val == null ? null : val),
    z.coerce.number().nullable(),
  ),
});

const GifImageSchema = z.object({
  url: z.string(),
  width: z.string(),
  height: z.string(),
});

const GiphyApiResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    images: z.object({
      original: GifImageSchema,
    }),
  }),
});

/**
 * Parses the Giphy API response to extract relevant GIF data.
 * @param data - The Giphy API response data.
 * @returns The parsed GIF data or null if no valid data exists.
 */
export const parseGifData = (data: unknown) => {
  try {
    return GiphyApiResponseSchema.parse(data);
  } catch (error) {
    throw new Error('Failed to parse GIF data');
  }
};

const parsedGifSchema = schema.omit({ id: true }).transform((data) => ({
  apiId: data.apiId ?? null,
  url: data.url ?? '',
  width: data.width ?? null,
  height: data.height ?? null,
}));

export type LocalGif = z.infer<typeof schema>;
export type GifImage = z.infer<typeof GifImageSchema>;
export type GiphyApiResponse = z.infer<typeof GiphyApiResponseSchema>;
export type ParsedGif = z.infer<typeof parsedGifSchema>;

export const parseGif = (record: GiphyApiResponse): ParsedGif => {
  const { id, images } = record.data;

  const gifData = {
    apiId: id,
    url: images.original.url,
    width: images.original.width,
    height: images.original.height,
  };
  return parsedGifSchema.parse(gifData);
};

export const parseInsertable = (record: unknown) =>
  parsedGifSchema.parse(record);
export const parseLocalGif = (record: unknown) => schema.parse(record);
export const keys: (keyof Record)[] = Object.keys(
  schema.shape,
) as (keyof z.infer<typeof schema>)[];
