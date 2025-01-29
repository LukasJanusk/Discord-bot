import type { Insertable, Selectable } from 'kysely';
import { keys } from './schema';
import type { User, Sprint, Message, Database } from '@/database';

const TABLE = 'message';
const SPRINT = 'sprint';
const USER = 'user';

type Row = Message;
type RowSprint = Sprint;
type RowUser = User;
type RowUserWithoutId = Omit<RowUser, 'id'>;
type RowUserInsert = Insertable<RowUserWithoutId>;
type RowUserSelect = Selectable<RowUser>;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowSelect = Selectable<Row>;
type RowSprintSelect = Selectable<RowSprint>;

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
  findBySprint(sprintCode: string): Promise<RowSelect[]> {
    return db
      .selectFrom(TABLE)
      .innerJoin(SPRINT, `${TABLE}.sprintId`, `${SPRINT}.id`)
      .select([
        `${TABLE}.id`,
        `${TABLE}.gifId`,
        `${TABLE}.sentAt`,
        `${TABLE}.sprintId`,
        `${TABLE}.templateId`,
        `${TABLE}.userId`,
      ])

      .where(`${SPRINT}.sprintCode`, '=', sprintCode)
      .execute();
  },
  findSprint(sprintCode: string): Promise<RowSprintSelect | undefined> {
    return db
      .selectFrom(SPRINT)
      .selectAll()
      .where(`${SPRINT}.sprintCode`, '=', sprintCode)
      .executeTakeFirst();
  },
  findByUsername(username: string): Promise<RowSelect[]> {
    return db
      .selectFrom(TABLE)
      .innerJoin(USER, `${TABLE}.userId`, `${USER}.id`)
      .select([
        `${TABLE}.id`,
        `${TABLE}.gifId`,
        `${TABLE}.sentAt`,
        `${TABLE}.sprintId`,
        `${TABLE}.templateId`,
        `${TABLE}.userId`,
      ])
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

  remove(id: number) {
    return db
      .deleteFrom(TABLE)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst();
  },
});
