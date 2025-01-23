interface GifImage {
  url: string;
  width: string;
  height: string;
}

export interface GiphyApiResponse {
  data: {
    type: string;
    id: string;
    url: string;
    images: {
      original: GifImage;
    };
  }[];
}

export interface ParsedGif {
  id: string;
  url: string;
  gifUrl: string;
  width: number;
  height: number;
}

/**
 * Parses the Giphy API response to extract relevant GIF data.
 * @param data - The Giphy API response data.
 * @returns The parsed GIF data or null if no valid data exists.
 */
export const parseGifData = (data: GiphyApiResponse): ParsedGif | null => {
  if (data.data) {
    const gif = Array.isArray(data.data) ? data.data[0] : data.data;
    return {
      id: gif.id,
      url: gif.url,
      gifUrl: gif.images.original.url,
      width: parseInt(gif.images.original.width, 10),
      height: parseInt(gif.images.original.height, 10),
    };
  }

  return null;
};
