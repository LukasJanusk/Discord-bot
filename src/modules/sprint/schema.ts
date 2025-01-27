import { z } from 'zod';
import { Sprint } from '@/database';
import { sprintCodeRegex } from '@/utils/regex';

type Record = Sprint;

const schema = z.object({
  id: z.number().int(),
  sprintCode: z.string().regex(sprintCodeRegex, {
    message:
      'Invalid sprintCode format. Must match one of: WD-#, DS-#, DA-#, DM-#',
  }),
});

const insertable = schema.omit({
  id: true,
});
const updateable = insertable.partial({ sprintCode: true });

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape,
) as (keyof z.infer<typeof schema>)[];
