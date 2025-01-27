import { z } from 'zod';
import type { Message, User } from '@/database';
import { sprintCodeRegex } from '@/utils/regex';

type Record = Message;
type Record2 = User;

export type RequestObject = {
  username: string;
  sprintCode: string;
};

const schema = z.object({
  id: z.coerce.number().int().positive(),
  sentAt: z.string().min(1).max(100),
  sprintId: z.coerce.number().int().positive(),
  templateId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
  gifId: z.coerce.number().int().positive(),
});

const insertable = schema.omit({
  id: true,
});

export const parse = (record: unknown) => schema.parse(record);
export const parseInsertable = (record: unknown) => insertable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape,
) as (keyof z.infer<typeof schema>)[];

const requestObject = z.object({
  username: z.string().min(1).max(100),
  sprintCode: z.string().regex(sprintCodeRegex, {
    message:
      'Invalid sprintCode format. Must match one of: WD-#, DS-#, DA-#, DM-#',
  }),
});

export const parseRequestObject = (record: unknown) =>
  requestObject.parse(record);

const schema2 = z.object({
  id: z.coerce.number().int().positive(),
  username: z.string().min(1).max(200),
});

export const parseUser = (record: unknown) =>
  requestObject.shape.username.parse(record);

export const parseSprint = (record: unknown) =>
  requestObject.shape.sprintCode.parse(record);

export const keys2: (keyof Record2)[] = Object.keys(
  schema2.shape,
) as (keyof z.infer<typeof schema2>)[];
