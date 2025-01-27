import { expect, it, describe } from 'vitest';
import { parse, parseInsertable, parseUpdateable } from '../schema';
import { fakeSprint, fakeSprintFull } from './utils';

describe('parse', () => {
  it('parses a valid record', () => {
    const record = fakeSprintFull();

    expect(parse(record)).toEqual(record);
  });
  it('throws an error due to empty/missing sprintCode (concrete)', () => {
    const sprintWithoutTitle = {
      id: 13,
    };
    const sprintEmptyTitle = {
      id: 13,
      sprintCode: '',
    };

    expect(() => parse(sprintWithoutTitle)).toThrow(/sprintCode/i);
    expect(() => parse(sprintEmptyTitle)).toThrow(/sprintCode/i);
  });
});

describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeSprintFull());

    expect(parsed).not.toHaveProperty('id');
  });
  it('rejects wrong format sprintCode', () => {
    const wrongFormatSprint = fakeSprint({ sprintCode: 'WD1.1' });

    expect(() => parseInsertable(wrongFormatSprint)).toThrowError(
      /Invalid sprintCode format/,
    );
  });
});

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdateable(fakeSprintFull());

    expect(parsed).not.toHaveProperty('id');
  });
  it('rejects wrong format sprintCode', () => {
    const wrongFormatSprint = fakeSprint({ sprintCode: 'WD1.1' });

    expect(() => parseUpdateable(wrongFormatSprint)).toThrowError(
      /Invalid sprintCode format/,
    );
  });
});
