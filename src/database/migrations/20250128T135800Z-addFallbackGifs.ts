import { Kysely, SqliteDatabase } from 'kysely';
import { TableReference } from 'kysely/dist/cjs/parser/table-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const assetsDir = path.resolve(
  currentDir,
  '../../modules/message/services/giphy/assets',
);

function getGifPath(number: number): string {
  return path.join(assetsDir, `${number}.gif`);
}

const gifData = [
  {
    url: getGifPath(1),
    width: 300,
    height: 302,
  },
  {
    url: getGifPath(2),
    width: 400,
    height: 400,
  },
  {
    url: getGifPath(3),
    width: 480,
    height: 480,
  },
  {
    url: getGifPath(4),
    width: 441,
    height: 353,
  },
];

export async function up(db: Kysely<SqliteDatabase>) {
  // @ts-ignore
  // it is not adviced to do data insertions during migrations
  // but it is easier to track initial and gradual database changes with migrations
  // since default values of these gifs will always remain same and there is no
  // other data as of current state of database we do data insertion here.
  // IMPORTANT! If path to giphy service assets changes
  // path to these initial gifs needs to be updated
  await db.insertInto('gif').values(gifData).execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.deleteFrom('gif' as TableReference<SqliteDatabase>).execute();
}
