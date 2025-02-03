import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import { it, describe, expect, afterAll, afterEach, beforeAll } from 'vitest';
import buildRepository from '../repository';
import { fakeMessage, messageMatcher } from './utils';
import { fakeGif } from '../services/giphy/tests/utils';
import { fakeTemplate } from '@/modules/template/tests/utils';
import { fakeSprint } from '@/modules/sprint/tests/utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createMessages = createFor(db, 'message');
const selectMessages = selectAllFor(db, 'message');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('message').execute();
});

beforeAll(async () => {
  await db.insertInto('gif').values(fakeGif()).execute();
  await db.insertInto('sprint').values(fakeSprint()).execute();
  await db.insertInto('template').values(fakeTemplate()).execute();
  await db.insertInto('user').values({ username: 'someName' }).execute();
});

describe('create', () => {
  it('should create a message (explicitly listing all fields)', async () => {
    const message = await repository.create({
      sentAt: '2025-01-27T15:32:48.123Z',
      text: 'some message text',
      sprintId: 1,
      templateId: 1,
      userId: 1,
      gifId: 1,
    });

    expect(message).toEqual({
      id: expect.any(Number),
      sentAt: '2025-01-27T15:32:48.123Z',
      text: 'some message text',
      sprintId: 1,
      templateId: 1,
      userId: 1,
      gifId: 1,
    });

    const messagesInDatabase = await selectMessages();
    expect(messagesInDatabase).toEqual([message]);
  });

  it('should create a message (with fake data functions)', async () => {
    const message = await repository.create(fakeMessage());

    expect(message).toEqual(messageMatcher());

    const messageInDatabase = await selectMessages();
    expect(messageInDatabase).toEqual([message]);
  });
});

describe('findAll', () => {
  it('should return all messages', async () => {
    const message1 = await repository.create({
      sentAt: '2025-01-27T15:32:48.123Z',
      text: 'some message text',
      sprintId: 1,
      templateId: 1,
      userId: 1,
      gifId: 1,
    });

    const message2 = await repository.create({
      sentAt: '2025-01-28T15:32:48.123Z',
      sprintId: 1,
      text: 'some message text',
      templateId: 1,
      userId: 1,
      gifId: 1,
    });

    const messages = await repository.findAll();
    expect(messages).toHaveLength(2);
    expect(messages[0]).toEqual(
      messageMatcher({
        sentAt: '2025-01-27T15:32:48.123Z',
        sprintId: 1,
        templateId: 1,
        userId: 1,
        gifId: 1,
      }),
    );
    expect(messages[1]).toEqual(
      messageMatcher({
        sentAt: '2025-01-28T15:32:48.123Z',
        sprintId: 1,
        templateId: 1,
        userId: 1,
        gifId: 1,
      }),
    );

    const messagesInDatabase = await selectMessages();
    expect(messagesInDatabase).toEqual([message1, message2]);
  });
});

describe('findById', () => {
  it('should return a message by id', async () => {
    const [message] = await createMessages(
      fakeMessage({
        id: 1371,
      }),
    );

    const foundMessage = await repository.findById(message!.id);

    expect(foundMessage).toEqual(messageMatcher());
  });

  it('should return undefined if message is not found', async () => {
    const foundMessage = await repository.findById(999999);

    expect(foundMessage).toBeUndefined();
  });
});

describe('findBySprint', () => {
  it('should return message based on sprint code', async () => {
    const [message] = await createMessages(fakeMessage());
    const sprint = 'WD-1.1';
    const foundBySprint = await repository.findBySprint(sprint);
    expect(foundBySprint).toEqual([message]);
  });
  it('should return undefined if message is not found', async () => {
    const sprint = 'WD-5.1';
    const notFoundSprint = await repository.findBySprint(sprint);
    expect(notFoundSprint).toEqual([]);
  });
});

describe('findByUsername', () => {
  it('returns array of messages when userfound', async () => {
    const [message] = await createMessages(fakeMessage());
    const userName = 'someName';
    const foundByUser = await repository.findByUsername(userName);
    expect(foundByUser).toEqual([message]);
  });
  it('returns undefined when user not found', async () => {
    const userName = 'wrongName';
    const notFoundUser = await repository.findByUsername(userName);
    expect(notFoundUser).toEqual([]);
  });
});
describe('findSprint', () => {
  it('should return if sprint matching provided sprintCode', async () => {
    const sprint = 'WD-1.1';
    const foundSprint = await repository.findSprint(sprint);
    expect(foundSprint!.sprintCode).toEqual(sprint);
  });
  it('should return undefined when sprint not found', async () => {
    const sprint = 'WD-5.1';
    const notFoundSprint = await repository.findSprint(sprint);
    expect(notFoundSprint).toBeUndefined();
  });
});
describe('remove', () => {
  it('should remove a message', async () => {
    const [message] = await createMessages(fakeMessage());

    const removedMessage = await repository.remove(message.id);

    expect(removedMessage).toEqual(messageMatcher());
  });

  it('should return undefined if message is not found', async () => {
    const notFoundMessage = await repository.remove(999);

    expect(notFoundMessage).toBeUndefined();
  });
});
describe('createUser', () => {
  it('retunrs created user', async () => {
    const user = await repository.createUser({ username: 'fakeUsername' });
    expect(user).toEqual({ id: expect.any(Number), username: 'fakeUsername' });
  });
  it('returns user if it already exists in db', async () => {
    const user = await repository.createUser({ username: 'existingUsername' });
    const userSameName = await repository.createUser({
      username: 'existingUsername',
    });
    expect(userSameName).toEqual(user);
  });
});
describe('findTemplate', () => {
  it('returns found template', async () => {
    const idNumber = 1;
    const template = await repository.findTemplate(idNumber);
    expect(template).toEqual(fakeTemplate({ id: idNumber }));
  });
  it('returns undefined when mo template found', async () => {
    const idNumber = 199;
    const template = await repository.findTemplate(idNumber);
    expect(template).toBeUndefined();
  });
});
