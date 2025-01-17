import supertest from 'supertest';
import { omit } from 'lodash/fp';
import createApp from '@/app';

// our test database is completely empty and it is only used by
// this test module, so we are free to do whatever we want with it

// const db = await createTestDatabase();
// const app = createApp(db);

// builds helper function to create articles

// const createArticles = createFor(db, 'article');

afterEach(async () => {
  // clearing the tested table after each test
  await db.deleteFrom('article').execute();
});

// close the database connection after all tests
// For SQLite, this is not necessary, but for other databases, it is.
// afterAll(() => db.destroy());

// This is not called "contoller.spec.ts" because we are specifying what this
// entire module should do, not just the controller.

// This could be moved to root-level tests folder, however, nearly always
// breaking tests here means issues in the articles module, so we are colocating
// it with the module.
describe('GET', () => {
  it('should return an empty array when there are no templates', async () => {
    // ACT (When we request...)
    // ASSERT (Then we should get...)
  });

  it('should return a list of existing templates', async () => {
    // ARRANGE (Given that we have...)
    // create fake templates in the db
    // ACT (When we request...)
    // ASSERT (Then we should get...)
  });
});

describe('GET /:id', () => {
  it('should return 404 if template does not exist', async () => {
    // ACT (When we request...)
    // ASSERT (Then we should get...)
    // Some error message that contains "not found".
    expect(body.error.message).toMatch(/not found/i);
  });

  it('should return an template if it exists', async () => {
    // ARRANGE (Given that we have...)
    // create fake template

    // ACT (When we request...)
    // request fake article

    // ASSERT (Then we should get...)
    expect(body).toEqual(
      articleMatcher({
        id: 1371,
      }),
    );
  });
});

describe('POST', () => {
  it('should return 400 if title is missing', async () => {
    // ACT (When we request...)
    // const { body } = await supertest(app)
    //   .post('/articles')
    //   .send(omit(['title'], fakeArticle({})))
      .expect(400); // a cheeky convenient expectation inside of ACT

    // ASSERT (Then we should get...)
    expect(body.error.message).toMatch(/title/i);
  });

  it('should return 400 if text is missing', async () => {
    // ACT (When we request...)
    const { body } = await supertest(app)
      .post('/templates')
      .send(omit(['text'], fakeArticle({})))
      .expect(400);

    // ASSERT (Then we should get...)
    expect(body.error.message).toMatch(/content/i);
  });

  it('does not allow to create an article with an empty title', async () => {
    // ACT (When we request...)
    // const { body } = await supertest(app)
    //   .post('/articles')
    //   .send(fakeArticle({ title: '' }))
    //   .expect(400);

    // ASSERT (Then we should get...)
    // expect(body.error.message).toMatch(/title/i);
  });

  it('does not allow to create an template with empty text', async () => {
    // const { body } = await supertest(app)
    //   .post('/articles')
    //   .send(fakeArticle({ content: '' }))
    //   .expect(400);

    // expect(body.error.message).toMatch(/content/i);
  });

  it('should return 201 and created template record', async () => {
    // ACT (When we request...)
    // to create a template
    // ASSERT :
    // article was created with correct response code
  });
});

describe('PATCH /:id', () => {
  it('returns 404 if article does not exist', async () => {
  });

  it('allows partial updates', async () => {
  });

  it('persists changes', async () => {
  });
});

describe('DELETE', () => {
  it('does not allo deleting templates ', async () => {
  });
});
