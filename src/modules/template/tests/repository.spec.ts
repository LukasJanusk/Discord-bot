import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import { it, describe, expect, afterAll, afterEach } from 'vitest';
import buildRepository from '../repository';
import { fakeTemplate, templateMatcher } from './utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createTemplates = createFor(db, 'template');
const selectTemplates = selectAllFor(db, 'template');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('template').execute();
});

describe('create', () => {
  it('should create an template (explicitly listing all fields)', async () => {
    const template = await repository.create({
      title: 'My Title',
      text: 'Some Content',
    });

    expect(template).toEqual({
      id: expect.any(Number),
      title: 'My Title',
      text: 'Some Content',
    });

    const templatesInDatabase = await selectTemplates();
    expect(templatesInDatabase).toEqual([template]);
  });

  it('should create an template (with fake data functions)', async () => {
    const template = await repository.create(fakeTemplate());

    expect(template).toEqual(templateMatcher());

    const templateInDatabase = await selectTemplates();
    expect(templateInDatabase).toEqual([template]);
  });
});

describe('findAll', () => {
  it('should return all templates', async () => {
    const template1 = await repository.create({
      title: 'Title 1',
      text: 'Content 1',
    });

    const template2 = await repository.create({
      title: 'Title 2',
      text: 'Content 2',
    });

    const templates = await repository.findAll();
    expect(templates).toHaveLength(2);
    expect(templates[0]).toEqual(
      templateMatcher({ title: 'Title 1', text: 'Content 1' }),
    );
    expect(templates[1]).toEqual(
      templateMatcher({ title: 'Title 2', text: 'Content 2' }),
    );

    const templatesInDatabase = await selectTemplates();
    expect(templatesInDatabase).toEqual([template1, template2]);
  });
});

describe('findById', () => {
  it('should return an template by id', async () => {
    const [template] = await createTemplates(
      fakeTemplate({
        id: 1371,
      }),
    );

    const foundTemplate = await repository.findById(template!.id);

    expect(foundTemplate).toEqual(templateMatcher());
  });

  it('should return undefined if template is not found', async () => {
    const foundTemplate = await repository.findById(999999);

    expect(foundTemplate).toBeUndefined();
  });
});

describe('update', () => {
  it('should update a template', async () => {
    const [template] = await createTemplates(fakeTemplate());

    const updatedTemplate = await repository.update(template.id, {
      title: 'Updated template',
    });

    expect(updatedTemplate).toMatchObject(
      templateMatcher({
        title: 'Updated template',
      }),
    );
  });

  it('should return the original template if no changes are made', async () => {
    const [template] = await createTemplates(fakeTemplate());

    const updatedTemplate = await repository.update(template.id, {});

    expect(updatedTemplate).toMatchObject(templateMatcher());
  });

  it('should return undefined if template is not found', async () => {
    const updatedTemplate = await repository.update(999, {
      title: 'Updated template',
    });
    expect(updatedTemplate).toBeUndefined();
  });
});

describe('remove', () => {
  it('should remove an template', async () => {
    const [template] = await createTemplates(fakeTemplate());

    const removedTemplate = await repository.remove(template.id);

    expect(removedTemplate).toEqual(templateMatcher());
  });

  it('should return undefined if template is not found', async () => {
    const notFoundTemplate = await repository.remove(999);

    expect(notFoundTemplate).toBeUndefined();
  });
});
