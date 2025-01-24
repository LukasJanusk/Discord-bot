import type {
  ExpressionOrFactory,
  Insertable,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely';
import { keys } from './schema';
import type { User, Sprint, Message, Database, DB } from '@/database';

const TABLE = 'message';
const SPRINT = 'sprint';
const USER = 'user';
type TableName = typeof TABLE;
type Row = Message;
type RowSprint = Sprint;
type RowUser = User;
type RowUserWithoutId = Omit<RowUser, 'id'>;
type RowUserInsert = Insertable<RowUserWithoutId>;
type RowUserSelect = Selectable<RowUser>;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
type RowSelect = Selectable<Row>;
type RowSprintSelect = Selectable<RowSprint>;

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute();
  },

  find(
    expression: ExpressionOrFactory<DB, TableName, SqlBool>,
  ): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).where(expression).execute();
  },

  findById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst();
  },
  findBySprint(sprintCode: string): Promise<RowSelect[] | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .innerJoin(SPRINT, `${TABLE}.sprintId`, `${SPRINT}.id`)
      .where(`${SPRINT}.sprintCode`, '=', sprintCode)
      .execute();
  },
  findSprint(sprintCode: string): Promise<RowSprintSelect | undefined> {
    return db
      .selectFrom(SPRINT)
      .selectAll()
      .where('sprintCode', '=', sprintCode)
      .executeTakeFirst();
  },
  findByUsername(username: string): Promise<RowSelect[] | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .innerJoin(USER, `${TABLE}.userId`, `${USER}.id`)
      .where(`${USER}.username`, '=', username)
      .execute();
  },
  create(record: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst();
  },
  async createUser(record: RowUserInsert): Promise<RowUserSelect | undefined> {
    const existingUser = await db
      .selectFrom(USER)
      .selectAll()
      .where('username', '=', record.username)
      .executeTakeFirst();

    if (existingUser) {
      return existingUser;
    }
    return db.insertInto(USER).values(record).returningAll().executeTakeFirst();
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
