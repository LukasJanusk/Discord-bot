import { expect } from 'vitest';
import type { Insertable } from 'kysely';
import type { Message } from '@/database';
import type { RequestObject } from '../schema';

export const fakeMessage = (
  overrides: Partial<Insertable<Message>> = {},
): Insertable<Message> => ({
  gifId: 1,
  sentAt: '2025-01-27T15:32:48.123Z',
  sprintId: 1,
  templateId: 1,
  userId: 1,
  text: 'some message text',
  ...overrides,
});

export const messageMatcher = (
  overrides: Partial<Insertable<Message>> = {},
) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeMessage(overrides),
});

export const fakeMessageFull = (
  overrides: Partial<Insertable<Message>> = {},
) => ({
  id: 2,
  ...fakeMessage(overrides),
});

export const fakeRequestObject = (
  overrides: Partial<RequestObject> = {},
): RequestObject => ({
  username: 'someuser',
  sprintCode: 'WD-1.1',
  ...overrides,
});
