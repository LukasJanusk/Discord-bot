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
    text: 'content',
  };
  const templateEmptyTitle = {
    id: 13,
    title: '',
    text: 'content',
  };

  expect(() => parse(templateWithoutTitle)).toThrow(/title/i);
  expect(() => parse(templateEmptyTitle)).toThrow(/title/i);
});

it('throws an error due to empty/missing text', () => {
  const recordWithoutText = omit(['text'], fakeTemplateFull());
  const recordEmpty = fakeTemplateFull({
    text: '',
  });

  expect(() => parse(recordWithoutText)).toThrow(/text/i);
  expect(() => parse(recordEmpty)).toThrow(/text/i);
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
