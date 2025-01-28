import { expect, it, describe } from 'vitest';
import { omit } from 'lodash';
import {
  parse,
  parseInsertable,
  parseRequestObject,
  parseUser,
  parseSprint,
} from '../schema';
import { fakeMessageFull, fakeRequestObject } from './utils';

it('parses a valid record', () => {
  const record = fakeMessageFull();

  expect(parse(record)).toEqual(record);
});

it('throws an error due to missing userId', () => {
  const messageWithoutUserId = {
    gifId: 3,
    sentAt: '2025-01-27T15:32:48.123Z',
    sprintId: 1,
    templateId: 1,
  };
  const messageEmptyUserId = {
    gifId: 3,
    sentAt: '2025-01-27T15:32:48.123Z',
    sprintId: 1,
    templateId: 1,
    userId: '',
  };

  expect(() => parse(messageWithoutUserId)).toThrow(/userId/i);
  expect(() => parse(messageEmptyUserId)).toThrow(/userId/i);
});

it('throws an error due to empty/missing templateId', () => {
  const messageWithoutTemplateId = {
    gifId: 3,
    sentAt: '2025-01-27T15:32:48.123Z',
    sprintId: 1,
    userId: 1,
  };
  const messageEmptyTemplateId = {
    gifId: 3,
    sentAt: '2025-01-27T15:32:48.123Z',
    sprintId: 1,
    templateId: '',
    userId: 1,
  };

  expect(() => parse(messageWithoutTemplateId)).toThrow(/templateId/i);
  expect(() => parse(messageEmptyTemplateId)).toThrow(/templateId/i);
});

describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeMessageFull());

    expect(parsed).not.toHaveProperty('id');
  });
});

describe('parseRequestObject', () => {
  it('parses a valid record', () => {
    const record = fakeRequestObject();

    expect(parseRequestObject(fakeRequestObject())).toEqual(record);
  });

  it('rejects when sprintCode is missing/empty', () => {
    const noSprintCode = omit(fakeRequestObject(), 'sprintCode');
    const emptySprintCode = { username: 'someusername', sprintCode: '' };

    expect(() => parseRequestObject(noSprintCode)).toThrow(/sprintCode/i);
    expect(() => parseRequestObject(emptySprintCode)).toThrow(/sprintCode/i);
  });

  it('rejects when username is missing/empty', () => {
    const noUsername = omit(fakeRequestObject(), 'username');
    const emptyUsername = { username: '', sprintCode: 'WD-1.1' };

    expect(() => parseRequestObject(noUsername)).toThrow(/username/i);
    expect(() => parseRequestObject(emptyUsername)).toThrow(/username/i);
  });
});

describe('parse username', () => {
  it('valid', () => {
    const record = 'goodname';
    const parsed = parseUser(record);

    expect(parsed).toEqual(record);
  });
  it('invalid', () => {
    const record = 1;
    expect(() => parseUser(record)).toThrowError(
      /Expected string, received number/i,
    );
  });
});

describe('parse SprintCode', () => {
  it('valid', () => {
    const record = 'WD-1.1';
    const parsed = parseSprint(record);

    expect(parsed).toEqual(record);
  });
  it('invalid', () => {
    const record = 1;
    expect(() => parseUser(record)).toThrowError(
      /Expected string, received number/i,
    );
  });
  it('invalid sprint Format', () => {
    const record = 'WZ-1.2';
    expect(() => parseSprint(record)).toThrowError(
      /Invalid sprintCode format/i,
    );
  });
});
