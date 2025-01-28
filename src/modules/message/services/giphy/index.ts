import { parseGifData, GiphyApiResponse, parseGif, ParsedGif } from './schema';

export interface GifAPI {
  /**
   * Sends a message to a guild text channel.
   * @param tag - Tag for GIF search
   * @returns A promise that resolves to Object.
   * @throws An error if fails to access API.
   */
  fetchGIF(tag: string): Promise<ParsedGif | null>;
}
export const getResponse = async (url: string): Promise<Response> => {
  const response = await fetch(url);
  if (response.ok) {
    return response;
  }
  throw new Error(
    `Failed to fetch GIF: ${response.statusText} (Status Code: ${response.status})`,
  );
};

export default (API_KEY: string): GifAPI => {
  const fetchGIF = async (tag: string): Promise<ParsedGif | null> => {
    try {
      const url = `https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&tag=${tag}&lang=en`;
      const response = await getResponse(url);
      const data = await response.json();
      const parsedResponse = parseGifData(data as GiphyApiResponse);
      return parseGif(parsedResponse);
    } catch (error) {
      // eslint-disable-next-line
      console.error(
        error instanceof Error
          ? `GIF API error: ${error.message}`
          : `GIF API error: unknown error occured`,
      );
      return null;
    }
  };

  return { fetchGIF };
};
