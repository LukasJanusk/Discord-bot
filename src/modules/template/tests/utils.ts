import { expect } from 'vitest';
import type { Insertable } from 'kysely';
import type { Template } from '@/database';

export const fakeTemplate = (
  overrides: Partial<Insertable<Template>> = {},
): Insertable<Template> => ({
  title: 'My Title',
  text: '<@${userId}> has just completed ${sprintTitle}. ${draft}',
  ...overrides,
});

export const templateMatcher = (
  overrides: Partial<Insertable<Template>> = {},
) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeTemplate(overrides),
});

export const fakeTemplateFull = (
  overrides: Partial<Insertable<Template>> = {},
) => ({
  id: 2,
  ...fakeTemplate(overrides),
});
