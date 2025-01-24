import { z } from 'zod';
import type { Gif } from '@/database';

type Record = Gif;

const schema = z.object({
  id: z.coerce.number().int().positive(),
  apiId: z.string(),
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

const GifImageSchema = z.object({
  url: z.string(),
  width: z.string(),
  height: z.string(),
});

const GiphyApiResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    url: z.string(),
    images: z.object({
      original: GifImageSchema,
    }),
  }),
});

const ParsedGifSchema = schema.omit({ id: true });

export type GifImage = z.infer<typeof GifImageSchema>;
export type GiphyApiResponse = z.infer<typeof GiphyApiResponseSchema>;
export type ParsedGif = z.infer<typeof ParsedGifSchema>;

/**
 * Parses the Giphy API response to extract relevant GIF data.
 * @param data - The Giphy API response data.
 * @returns The parsed GIF data or null if no valid data exists.
 */
export const parseGifData = (data: GiphyApiResponse): ParsedGif => {
  const result = GiphyApiResponseSchema.safeParse(data);
  if (result.success) {
    const gif = result.data.data;

    return {
      apiId: gif.id,
      url: gif.images.original.url,
      width: parseInt(gif.images.original.width, 10),
      height: parseInt(gif.images.original.height, 10),
    };
  }

  throw new Error(
    `Failed to parse GIF data: ${JSON.stringify(result.error.errors, null, 2)}`,
  );
};

const insertable = ParsedGifSchema.partial({
  apiId: true,
  width: true,
  height: true,
});

export const parseInsertable = (record: unknown) => insertable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  ParsedGifSchema.shape,
) as (keyof z.infer<typeof ParsedGifSchema>)[];
