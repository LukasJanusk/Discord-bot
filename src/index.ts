import {
  DATABASE_URL,
  DISCORD_BOT_TOKEN,
  CHANNEL_ID,
  GIPHY_API_KEY,
} from '@/config';
import createApp from './app';
import createDatabase from './database';
import createDiscordBot from './modules/message/services/discord';
import createGiphyAPi from './modules/message/services/giphy';

const PORT = 3000;

const database = createDatabase(DATABASE_URL);
const giphyApi = createGiphyAPi(GIPHY_API_KEY);
const discordBot = await createDiscordBot(DISCORD_BOT_TOKEN, CHANNEL_ID);
const app = createApp(database, discordBot, giphyApi);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`server is running at http://localhost:${PORT}`);
});
