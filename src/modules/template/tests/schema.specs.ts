import { parse, parseInsertable, parseUpdateable } from '../schema';

// Generally, schemas are tested with a few examples of valid and invalid records.

it('parses a valid record', () => {
  const record = dakeTemplateFull();

  expect(parse(record)).toEqual(record);
});

it('throws an error due to empty/missing title (concrete)', () => {
  // ARRANGE
  const templateWithoutTitle = {
    id: 52,
    title: '',
    text: 'content',
  };
  const templateEmptyTitle = {
    id: 52,
    title: '',
    text: 'content',
  };

  // ACT & ASSERT
  // expect our function to throw an error that
  // mentions an issue with the title
  expect(() => parse(articleWithoutTitle)).toThrow(/title/i);
  expect(() => parse(articleEmptyTitle)).toThrow(/title/i);
});
