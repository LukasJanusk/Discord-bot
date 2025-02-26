import type { Insertable, Selectable, Updateable } from 'kysely';
import { keys } from './schema';
import type { Database, Gif } from '@/database';

const TABLE = 'gif';
type Row = Gif;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
export type RowSelect = Selectable<Row>;

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute();
  },

  findById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst();
  },
  async create(record: RowInsert): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .where('url', '=', record.url)
      .select(keys)
      .executeTakeFirst()
      .then((existingRecord) => {
        if (existingRecord) {
          return existingRecord;
        }

        return db
          .insertInto(TABLE)
          .values(record)
          .returning(keys)
          .executeTakeFirst();
      });
  },

  update(id: number, partial: RowUpdate): Promise<RowSelect | undefined> {
    if (Object.keys(partial).length === 0) {
      return this.findById(id);
    }

    return db
      .updateTable(TABLE)
      .set(partial)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst();
  },

  remove(id: number) {
    return db
      .deleteFrom(TABLE)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst();
  },
});
