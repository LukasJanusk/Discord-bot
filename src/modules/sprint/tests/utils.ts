import { expect } from 'vitest';
import type { Insertable } from 'kysely';
import type { Sprint } from '@/database';

export const fakeSprint = (
  overrides: Partial<Insertable<Sprint>> = {},
): Insertable<Sprint> => ({
  sprintCode: 'WD-1.1',
  title: 'someTitle',
  ...overrides,
});

export const sprintMatcher = (overrides: Partial<Insertable<Sprint>> = {}) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeSprint(overrides),
});

export const fakeSprintFull = (
  overrides: Partial<Insertable<Sprint>> = {},
) => ({
  id: 2,
  ...fakeSprint(overrides),
});
