import { GIPHY_API_KEY } from 'config';
import { parseGifData, GiphyApiResponse, ParsedGif } from './schema';

export interface GifAPI {
  /**
   * Sends a message to a guild text channel.
   * @param tag - Tag for GIF search
   * @returns A promise that resolves to Object.
   * @throws An error if fails to access API.
   */
  fetchGIF(tag: string): Promise<ParsedGif | null>;
  /**
   * Fetches a GIF by its ID.
   * @param id - The unique ID of the GIF.
   * @returns A promise that resolves to ParsedGif or null.
   * @throws An error if fails to access API.
   */
  fetchGifById(id: string): Promise<ParsedGif | null>;
}

export default (): GifAPI => {
  const fetchGIF = async (tag: string) => {
    try {
      const url = `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=${tag}&lang=en`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        return parseGifData(data as GiphyApiResponse);
      }
      throw new Error(`Failed to fetch GIF: ${response.statusText}`);
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

  const fetchGifById = async (id: string): Promise<ParsedGif | null> => {
    try {
      const url = `https://api.giphy.com/v1/gifs/${id}?api_key=${GIPHY_API_KEY}`;
      const response = await fetch(url);
      const data = (await response.json()) as GiphyApiResponse;

      if (response.ok) {
        return parseGifData(data);
      }
      throw new Error(`Failed to fetch GIF by ID: ${response.statusText}`);
    } catch (error) {
      // eslint-disable-next-line
      console.error(
        error instanceof Error
          ? `Error fetching API occurred: ${error.message}`
          : `Unknown error occurred`,
      );
      return null;
    }
  };
  return { fetchGIF, fetchGifById };
};
