import { omit } from 'lodash/fp';
import { expect, it, describe } from 'vitest';
import { parse, parseInsertable, parseUpdateable } from '../schema';
import { fakeTemplateFull } from './utils';

it('parses a valid record', () => {
  const record = fakeTemplateFull();

  expect(parse(record)).toEqual(record);
});

it('throws an error due to empty/missing title (concrete)', () => {
  const templateWithoutTitle = {
    id: 13,
    title: '',
    text: '<@${userId}> has just completed ${sprintTitle}. ${draft}',
  };
  const templateEmptyTitle = {
    id: 13,
    title: '',
    text: '<@${userId}> has just completed ${sprintTitle}. ${draft}',
  };

  expect(() => parse(templateWithoutTitle)).toThrow(/title/i);
  expect(() => parse(templateEmptyTitle)).toThrow(/title/i);
});

it('throws an error due to empty/missing/wrong text', () => {
  const recordWithoutText = omit(['text'], fakeTemplateFull());
  const recordEmpty = fakeTemplateFull({
    text: '',
  });
  const recordWithWrongTitleFormat = fakeTemplateFull({
    text: 'This will not pass regex',
  });
  expect(() => parse(recordWithoutText)).toThrow(/text/i);
  expect(() => parse(recordEmpty)).toThrow(/text/i);
  expect(() => parse(recordWithWrongTitleFormat)).toThrow(/text/i);
});

describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeTemplateFull());

    expect(parsed).not.toHaveProperty('id');
  });
});

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdateable(fakeTemplateFull());

    expect(parsed).not.toHaveProperty('id');
  });
});
