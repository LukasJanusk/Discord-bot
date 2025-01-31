import { omit } from 'lodash/fp';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import { describe, it, expect, afterEach, afterAll } from 'vitest';
import supertest from 'supertest';
import createDiscordBot from '@tests/utils/createDiscordBot';
import createApp from '@/app';
import { fakeSprint, sprintMatcher } from './utils';
import createGiphyApi from '@/modules/message/services/giphy';

const db = await createTestDatabase();
const fakeDiscordBot = createDiscordBot();
const fakeGifApi = createGiphyApi('fake_key');
const app = createApp(db, fakeDiscordBot, fakeGifApi);

const createSprints = createFor(db, 'sprint');

afterEach(async () => {
  await db.deleteFrom('sprint').execute();
});

afterAll(() => db.destroy());

describe('GET', () => {
  it('should return an empty array when there are no sprints', async () => {
    const { body } = await supertest(app).get('/sprints').expect(200);

    expect(body).toEqual([]);
  });

  it('should return a list of existing sprints', async () => {
    createSprints([fakeSprint(), fakeSprint({ sprintCode: 'DA-3.3' })]);
    const { body } = await supertest(app).get('/sprints').expect(200);
    expect(body.length).toEqual(2);
    expect(body).toEqual([
      sprintMatcher(),
      sprintMatcher({ sprintCode: 'DA-3.3' }),
    ]);
  });
});

describe('GET /:id', () => {
  it('should return 404 if sprint does not exist', async () => {
    const { body } = await supertest(app).get('/sprints/999').expect(404);
    expect(body.error.message).toMatch(/not found/i);
  });

  it('should return an sprint if it exists', async () => {
    createSprints([fakeSprint({ id: 888 })]);

    const { body } = await supertest(app).get('/sprints/888').expect(200);

    expect(body).toEqual(
      sprintMatcher({
        id: 888,
      }),
    );
  });
});

describe('POST', () => {
  it('should return 400 if sprintCode is missing', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(omit(['sprintCode'], fakeSprint({})))
      .expect(400);
    expect(body.error.message).toMatch(/sprintCode/i);
  });

  it('does not allow to create an sprint with an empty sprintCode', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(fakeSprint({ sprintCode: '' }))
      .expect(400);
    expect(body.error.message).toMatch(/sprintCode/i);
  });
  it('should return 201 and created sprint record', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(fakeSprint())
      .expect(201);

    expect(body).toEqual(sprintMatcher(fakeSprint()));
  });
  it('does not allow to create an sprint with an incorrect sprintCode', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(fakeSprint({ sprintCode: 'WS-1.1' }))
      .expect(400);

    expect(body.error.message).toMatch(/sprintCode/i);
  });
});

describe('PATCH /:id', () => {
  it('returns 404 if article does not exist', async () => {
    const { body } = await supertest(app)
      .patch('/sprints/999')
      .send(fakeSprint())
      .expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('allows updates', async () => {
    createSprints([fakeSprint({ id: 111, sprintCode: 'WD-3.3' })]);

    const { body } = await supertest(app)
      .patch('/sprints/111')
      .send({ sprintCode: 'DS-1.2' })
      .expect(200);

    expect(body).toEqual(
      sprintMatcher({
        sprintCode: 'DS-1.2',
      }),
    );
  });

  it('persists changes', async () => {
    await createSprints([fakeSprint({ id: 222 })]);

    await supertest(app)
      .patch('/sprints/222')
      .send({ sprintCode: 'DS-1.2' })
      .expect(200);

    const { body } = await supertest(app).get('/sprints/222').expect(200);

    expect(body).toEqual(
      sprintMatcher({
        id: 222,
        sprintCode: 'DS-1.2',
      }),
    );
  });
});

describe('DELETE', () => {
  it('deletes sprint', async () => {
    await createSprints([fakeSprint({ id: 333 })]);

    const { body } = await supertest(app).delete('/sprints/333').expect(200);

    expect(body).toEqual(sprintMatcher({ id: 333 }));
  });
  it('returns 404 not found when id not found in db is provided', async () => {
    const { body } = await supertest(app).delete('/sprints/123').expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });
});

describe('method not allowed for not allowed HTML methods', () => {
  it('/sprints', async () => {
    const { body } = await supertest(app).put(`/sprints`).expect(405);
    expect(body.error.message).toMatch(/Method not allowed/i);
  });
  it('/sprints/:id', async () => {
    const { body } = await supertest(app).put(`/sprints/1`).expect(405);
    expect(body.error.message).toMatch(/Method not allowed/i);
  });
});
