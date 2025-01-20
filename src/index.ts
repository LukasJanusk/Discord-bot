import createApp from './app';
import createDatabase from './database';

const PORT = 3000;
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in your environment variables.');
}
const database = createDatabase(DATABASE_URL);
const app = createApp(database);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`server is running at http://localhost:${PORT}`);
});
