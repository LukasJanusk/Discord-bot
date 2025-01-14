// reading environment variables from .env file
import 'dotenv/config';
import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import type { DB } from './types'; // we handle this in the next step

export * from './types'; // we handle this in the next step

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in your environment variables.');
}
const database = new Database(DATABASE_URL);
const dialect = new SqliteDialect({ database });
export default new Kysely<DB>({
  dialect,
  plugins: [new CamelCasePlugin()],
});
