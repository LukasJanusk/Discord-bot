import { z } from 'zod';
import type { Template } from '@/database';
import { draftPattern, sprintTitlePattern, userIdPatter } from '@/utils/regex';

type Record = Template;

const schema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().min(1).max(100),
  text: z
    .string()
    .min(1)
    .max(2000)
    .regex(draftPattern, 'Text must contain ${draft}')
    .regex(sprintTitlePattern, 'Text must contain ${sprintTitle}')
    .regex(userIdPatter, 'Text must contain <@${userId}>'),
});

const insertable = schema.omit({
  id: true,
});
const updateable = insertable.partial();

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape,
) as (keyof z.infer<typeof schema>)[];
