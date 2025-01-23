import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('gif')
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('url', 'text', (c) => c.notNull())
    .addColumn('id_in_api', 'integer', (c) => c.notNull())
    .addColumn('width', 'integer', (c) => c.notNull())
    .addColumn('height', 'integer', (c) => c.notNull())
    .execute();

  await db.schema
    .alterTable('message')
    .addColumn('gif_id', 'integer', (c) => c.references('gif.id'))
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.alterTable('message').dropColumn('gif_id').execute();
  await db.schema.dropTable('gif').execute();
}
