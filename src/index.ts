import { DATABASE_URL } from 'config';
import createApp from './app';
import createDatabase from './database';

const PORT = 3000;

const database = createDatabase(DATABASE_URL);
const app = await createApp(database);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`server is running at http://localhost:${PORT}`);
});
