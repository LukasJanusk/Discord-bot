import { expect, it, describe } from 'vitest';
import { parse, parseInsertable, parseUpdateable } from '../schema';
import { fakeSprint, fakeSprintFull } from './utils';

describe('parse', () => {
  it('parses a valid record', () => {
    const record = fakeSprintFull();

    expect(parse(record)).toEqual(record);
  });
  it('throws an error due to empty/missing sprintCode (concrete)', () => {
    const sprintWithoutCode = {
      id: 13,
      title: 'someTitle',
    };
    const sprintEmptyCode = {
      id: 13,
      sprintCode: '',
      title: 'someTitle',
    };

    expect(() => parse(sprintWithoutCode)).toThrow(/sprintCode/i);
    expect(() => parse(sprintEmptyCode)).toThrow(/sprintCode/i);
  });
  it('throws an error due to empty/missing title (concrete)', () => {
    const sprintWithoutTitle = {
      id: 13,
      sprintCode: 'WD-1.1',
    };
    const sprintEmptyTitle = {
      id: 13,
      sprintCode: 'WD-1.1',
      title: '',
    };

    expect(() => parse(sprintWithoutTitle)).toThrow(/title/i);
    expect(() => parse(sprintEmptyTitle)).toThrow(/title/i);
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
