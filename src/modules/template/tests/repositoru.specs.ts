const db = await createTestDatabase();
const repository = buildRepository(db);
const createTemplates = createFor(db, 'template');
const selectTemplates = selectAllFor(db, 'template');

afterAll(() => db.destroy());

afterEach(async () => {
  // clearing the tested table after each test
  await db.deleteFrom('template').execute();
});

describe('create', () => {
  it('should create an template (explicitly listing all fields)', async () => {
    // ACT (When we call...)
    // const template = await repository.create({
    //   title: 'My Title',
    //   text: 'Some Content',
    // });
    // ASSERT (Then we should get...)
    // checking the returned template
    // any number is fine, we might want to check that it is an integer
    // but this is good enough to drive our development
    // expect(template).toEqual({
    //   id: expect.any(Number),
    //   title: 'My Title',
    //   content: 'Some Content',
    // });
    // checking directly in the database if it is equal in the database
  });

  it('should not create template, when text is missing', async () => {});
  it('should not create template, when title is missing', async () => {});
});

describe('findAll', () => {
  it('should return all templates', async () => {});
});

describe('findById', () => {
  it('should return an template by id', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    // ACT (When we call...)
    // ASSERT (Then we should get...)
  });

  it('should return undefined if template is not found', async () => {});
});

describe('update', () => {
  it('should update a template', async () => {
    // ARRANGE (Given that we have the following record in the database...
    // ACT (When we call...)
    // ASSERT (Then we should get...)
  });

  it('should return the original template if no changes are made', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    // ACT (When we call...)
    // ASSERT (Then we should get...)
  });

  it('should return undefined if template is not found', async () => {
    // ACT (When we call...)
    // We could also opt for throwing an error here, but this is a design decision
    // ASSERT (Then we should get...)
  });
});

describe('remove', () => {
  it('should remove an template', async () => {
    // Does not allow deleting template
  });

  it('should return undefined if template is not found', async () => {});
});
