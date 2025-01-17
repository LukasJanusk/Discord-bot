import { z } from 'zod';

const insertable = z.object({
  id: z.number().int(),
  discordName: z.string(),
});

export const parseInsertable = (record: unknown) => insertable.parse(record);
