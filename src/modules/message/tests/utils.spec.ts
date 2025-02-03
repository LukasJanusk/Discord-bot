import { it, describe, expect } from 'vitest';
import { formatMessageForDiscord } from '../utils';

describe('formatMessageForDiscord', () => {
  it('formats correct message', () => {
    const formatted = formatMessageForDiscord(
      '<@${userId}> has just completed ${sprintTitle}. ${draft}',
      'Object oriented programming',
      'Congratulations you did it!',
      'FakeUserId123',
    );
    expect(formatted).toEqual(
      '<@FakeUserId123> has just completed Object oriented programming. Congratulations you did it!',
    );
  });
});
