import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema.alterTable('template').renameTo('draft').execute();

  await db.schema
    .createTable('template')
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('title', 'text', (c) => c.notNull())
    .addColumn('text', 'text', (c) => c.notNull())
    .execute();
  await db.schema.dropTable('message').execute();
  await db.schema
    .createTable('message')
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('user_id', 'integer', (c) => c.notNull().references('user.id'))
    .addColumn('text', 'text', (c) => c.notNull())
    .addColumn('sprint_id', 'integer', (c) =>
      c.notNull().references('sprint.id'),
    )
    .addColumn('template_id', 'integer', (c) =>
      c.notNull().references('template.id'),
    )
    .addColumn('sent_at', 'timestamp', (c) => c.notNull())
    .execute();

  await db.schema.dropTable('sprint').execute();
  await db.schema
    .createTable('sprint')
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('sprint_code', 'text', (c) => c.notNull())
    .addColumn('title', 'text', (c) => c.notNull())
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('message').execute();

  await db.schema
    .createTable('message')
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('user_id', 'integer', (c) => c.notNull().references('user.id'))
    .addColumn('sprint_id', 'integer', (c) =>
      c.notNull().references('sprint.id'),
    )
    .addColumn('template_id', 'integer', (c) =>
      c.notNull().references('template.id'),
    )
    .addColumn('sent_at', 'timestamp', (c) => c.notNull())
    .execute();
  await db.schema.dropTable('sprint').execute();

  await db.schema
    .createTable('sprint')
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('sprint_code', 'text', (c) => c.notNull())
    .addColumn('title', 'text', (c) => c.notNull())
    .execute();

  await db.schema.dropTable('template').execute();
  await db.schema.alterTable('draft').renameTo('template').execute();
}
