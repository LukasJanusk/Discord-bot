import { omit } from 'lodash/fp';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import { describe, it, expect, afterEach, afterAll } from 'vitest';
import supertest from 'supertest';
import createApp from '@/app';
import { fakeTemplate, templateMatcher } from './utils';

const db = await createTestDatabase();
const app = createApp(db);

const createTemplates = createFor(db, 'template');

afterEach(async () => {
  await db.deleteFrom('template').execute();
});

afterAll(() => db.destroy());

describe('GET', () => {
  it('should return an empty array when there are no templates', async () => {
    const { body } = await supertest(app).get('/templates').expect(200);

    expect(body).toEqual([]);
  });

  it('should return a list of existing templates', async () => {
    createTemplates([
      fakeTemplate(),
      fakeTemplate({ title: 'Title2', text: 'Text2' }),
    ]);
    const { body } = await supertest(app).get('/templates').expect(200);
    expect(body.length).toEqual(2);
    expect(body).toEqual([
      templateMatcher(),
      templateMatcher({ title: 'Title2', text: 'Text2' }),
    ]);
  });
});

describe('GET /:id', () => {
  it('should return 404 if template does not exist', async () => {
    const { body } = await supertest(app).get('/templates/999').expect(404);
    expect(body.error.message).toMatch(/not found/i);
  });

  it('should return an template if it exists', async () => {
    createTemplates([fakeTemplate({ id: 777 })]);

    const { body } = await supertest(app).get('/templates/777').expect(200);

    expect(body).toEqual(
      templateMatcher({
        id: 777,
      }),
    );
  });
});

describe('POST', () => {
  it('should return 400 if title is missing', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(omit(['title'], fakeTemplate({})))
      .expect(400);
    expect(body.error.message).toMatch(/title/i);
  });

  it('should return 400 if text is missing', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(omit(['text'], fakeTemplate({})))
      .expect(400);
    expect(body.error.message).toMatch(/text/i);
  });

  it('does not allow to create an article with an empty title', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(fakeTemplate({ title: '' }))
      .expect(400);
    expect(body.error.message).toMatch(/title/i);
  });

  it('does not allow to create an template with empty text', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(fakeTemplate({ text: '' }))
      .expect(400);
    expect(body.error.message).toMatch(/text/i);
  });

  it('should return 201 and created template record', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(fakeTemplate())
      .expect(201);

    expect(body).toEqual(templateMatcher(fakeTemplate()));
  });
});

describe('PATCH /:id', () => {
  it('returns 404 if article does not exist', async () => {
    const { body } = await supertest(app)
      .patch('/templates/999')
      .send(fakeTemplate())
      .expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('allows partial updates', async () => {
    createTemplates([fakeTemplate({ id: 111, title: 'fake template' })]);

    const { body } = await supertest(app)
      .patch('/templates/111')
      .send({ title: 'updated fake template' })
      .expect(200);

    expect(body).toEqual(
      templateMatcher({
        id: 111,
        title: 'updated fake template',
      }),
    );
  });

  it('persists changes', async () => {
    await createTemplates([fakeTemplate({ id: 222 })]);

    await supertest(app)
      .patch('/templates/222')
      .send({ title: 'updated fake template', text: 'updated text' })
      .expect(200);

    const { body } = await supertest(app).get('/templates/222').expect(200);

    expect(body).toEqual(
      templateMatcher({
        id: 222,
        title: 'updated fake template',
        text: 'updated text',
      }),
    );
  });
});

describe('DELETE', () => {
  it('deletes template', async () => {
    await createTemplates([fakeTemplate({ id: 333 })]);

    const { body } = await supertest(app).delete('/templates/333').expect(200);

    expect(body).toEqual(templateMatcher({ id: 333 }));
  });
  it('returns 404 not found when id not found in db is privided', async () => {
    const { body } = await supertest(app).delete('/templates/123').expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });
});
