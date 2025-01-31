import { it, expect, vi } from 'vitest';
import createGiphyApi, { getResponse } from '../index';

beforeEach(() => {
  vi.clearAllMocks();
});
const API_KEY = 'fake_key';
describe('createGiphyApi', () => {
  it('logs error if fails to access API', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const giphyApi = createGiphyApi(API_KEY);

    await giphyApi.fetchGIF('random');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('GIF API error: Failed to fetch GIF'),
    );

    consoleSpy.mockRestore();
  });

  it('returns null if fails to access API', async () => {
    const giphyApi = createGiphyApi(API_KEY);
    const response = await giphyApi.fetchGIF('random');

    expect(response).toEqual(null);
  });
});
describe('getResponse', () => {
  it('throws error if bad url provided', async () => {
    const badUrl =
      'https://api.giphy.com/v1/gifs/random?api_key=invalid-api-key&tag=funny&lang=en';
    await expect(getResponse(badUrl)).rejects.toThrowError(
      /Failed to fetch GIF:/,
    );
  });
  it('returns response from api', async () => {
    const url = 'some.url.example';
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve({ data: ['someGif'] }),
      }),
    ) as unknown as typeof fetch;
    const response = await getResponse(url);

    expect(response.status).toEqual(200);
  });
});
