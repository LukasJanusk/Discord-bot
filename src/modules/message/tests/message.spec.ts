import supertest from 'supertest';
import { it, expect } from 'vitest';
import { createFor } from '@tests/utils/records';
import createTestDatabase from '@tests/utils/createTestDatabase';
import createDiscordBot from '@tests/utils/createDiscordBot';
import {
  createGiphyAPIGoodReturn,
  createGiphyAPIBadReturn,
} from '@tests/utils/createGiphyAPI';
import createApp from '@/app';
import { fakeGif } from '../services/giphy/tests/utils';
import { fakeSprint } from '@/modules/sprint/tests/utils';
import { fakeTemplate } from '@/modules/template/tests/utils';
import { fakeMessage, messageMatcher } from './utils';

const db = await createTestDatabase();
const fakeDiscordBot = createDiscordBot();
const fakeGifApiBad = createGiphyAPIBadReturn('fake_key');
const fakeGifApiGood = createGiphyAPIGoodReturn('fake_key');

const app = createApp(db, fakeDiscordBot, fakeGifApiGood);
const app2 = createApp(db, fakeDiscordBot, fakeGifApiBad);

const createMessages = createFor(db, 'message');

beforeAll(async () => {
  await db.insertInto('gif').values(fakeGif()).execute();
  await db.insertInto('sprint').values(fakeSprint()).execute();
  await db.insertInto('template').values(fakeTemplate()).execute();
  await db.insertInto('user').values({ username: 'someName' }).execute();
});
afterEach(async () => {
  await db.deleteFrom('message').execute();
});

afterAll(() => db.destroy());

describe('GET', () => {
  it('should return an empty array when there are no messages', async () => {
    const { body } = await supertest(app).get('/messages').expect(200);

    expect(body).toEqual([]);
  });

  it('should return a list of existing messages', async () => {
    createMessages([
      fakeMessage(),
      fakeMessage({
        sentAt: '2025-01-28T15:32:48.123Z',
        sprintId: 1,
        templateId: 1,
        userId: 1,
        gifId: 1,
      }),
    ]);
    const { body } = await supertest(app).get('/messages').expect(200);
    expect(body.length).toEqual(2);
    expect(body).toEqual([
      messageMatcher(),
      messageMatcher({
        sentAt: '2025-01-28T15:32:48.123Z',
        sprintId: 1,
        templateId: 1,
        userId: 1,
        gifId: 1,
      }),
    ]);
  });
});
describe('POST', () => {
  it('should return 400 if username is missing', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({ username: '', sprintCode: 'WD-1.1' })
      .expect(400);
    expect(body.error.message).toMatch(/username/i);
  });

  it('should return 400 if sprintCode is missing', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({ username: 'someName', sprintCode: '' })
      .expect(400);
    expect(body.error.message).toMatch(/Invalid sprintCode format/i);
  });
  it('should return 400 if sprintCode is invalid', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({ username: 'someName', sprintCode: 'DW-1.2' })
      .expect(400);
    expect(body.error.message).toMatch(/Invalid sprintCode format/i);
  });

  it('should return 201 and created message record with good Giphy api call', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({ username: 'correct_name', sprintCode: 'WD-1.1' })
      .expect(201);

    expect(body).toEqual(
      messageMatcher(
        fakeMessage({
          sentAt: expect.any(String),
          userId: expect.any(Number),
          gifId: expect.any(Number),
        }),
      ),
    );
  });
  it('should return 201 and created message record with bad Giphy api call', async () => {
    const { body } = await supertest(app2)
      .post('/messages')
      .send({ username: 'correct_name', sprintCode: 'WD-1.1' })
      .expect(201);

    expect(body).toEqual(
      messageMatcher(
        fakeMessage({
          sentAt: expect.any(String),
          userId: expect.any(Number),
          gifId: expect.any(Number),
        }),
      ),
    );
  });
});

describe('username/:username', async () => {
  it('returns messages when found', async () => {
    createMessages([fakeMessage()]);
    const username = 'someName';
    const { body } = await supertest(app)
      .get(`/messages/username/${username}`)
      .expect(200);

    expect(body).toEqual([messageMatcher(fakeMessage())]);
  });
  it('returns an empty array when no messages found', async () => {
    const { body } = await supertest(app)
      .get(`/messages/username/fake_name`)
      .expect(200);

    expect(body).toEqual([]);
  });
});
describe('sprint/:sprint', async () => {
  it('returns messages when found', async () => {
    createMessages([fakeMessage()]);
    const sprint = 'WD-1.1';
    const { body } = await supertest(app)
      .get(`/messages/sprint/${sprint}`)
      .expect(200);

    expect(body).toEqual([messageMatcher(fakeMessage())]);
  });

  it('returns an empty array when no messages found', async () => {
    const sprint = 'WD-1.1';
    const { body } = await supertest(app)
      .get(`/messages/sprint/${sprint}`)
      .expect(200);

    expect(body).toEqual([]);
  });
});
describe('method not allowed for not allowed HTML methods', () => {
  it('/messages', async () => {
    const { body } = await supertest(app).patch(`/messages/`).expect(405);
    expect(body.error.message).toMatch(/Method not allowed f/i);
  });
  it('/messages/sprint/:sprint', async () => {
    const username = 'WD-1.1';
    const { body } = await supertest(app)
      .patch(`/messages/sprint/${username}`)
      .expect(405);
    expect(body.error.message).toMatch(/Method not allowed f/i);
  });
  it('/messages/username/:username', async () => {
    const sprint = 'WD-1.1';
    const { body } = await supertest(app)
      .patch(`/messages/sprint/${sprint}`)
      .expect(405);
    expect(body.error.message).toMatch(/Method not allowed f/i);
  });
});
