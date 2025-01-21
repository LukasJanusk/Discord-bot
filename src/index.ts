import createApp from './app';
import createDatabase from './database';
import createDiscordBot from './modules/message/services/discord';

const PORT = 3000;
const { DATABASE_URL, DISCORD_BOT_TOKEN, CHANNEL_ID } = process.env;

if (!CHANNEL_ID) {
  throw new Error('Channel Id not found');
}
if (!DISCORD_BOT_TOKEN) {
  throw new Error('Channel Id not found');
}
if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in your environment variables.');
}
const database = createDatabase(DATABASE_URL);
const bot = await createDiscordBot(DISCORD_BOT_TOKEN, CHANNEL_ID);
const app = await createApp(database, bot);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`server is running at http://localhost:${PORT}`);
});
