import { z } from 'zod';

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

const ParsedGifSchema = z.object({
  id: z.string(),
  url: z.string(),
  gifUrl: z.string(),
  width: z.number(),
  height: z.number(),
});

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
      id: gif.id,
      url: gif.url,
      gifUrl: gif.images.original.url,
      width: parseInt(gif.images.original.width, 10),
      height: parseInt(gif.images.original.height, 10),
    };
  }

  throw new Error(
    `Failed to parse GIF data: ${JSON.stringify(result.error.errors, null, 2)}`,
  );
};
