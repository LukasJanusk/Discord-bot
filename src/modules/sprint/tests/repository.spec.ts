import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import { it, describe, expect, afterAll, afterEach } from 'vitest';
import buildRepository from '../repository';
import { fakeSprint, sprintMatcher } from './utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createSprints = createFor(db, 'sprint');
const selectSprints = selectAllFor(db, 'sprint');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('sprint').execute();
});

describe('create', () => {
  it('should create an sprint', async () => {
    const sprint = await repository.create({
      sprintCode: 'WD-1.1',
    });

    expect(sprint).toEqual({
      id: expect.any(Number),
      sprintCode: 'WD-1.1',
    });

    const sprintsInDatabase = await selectSprints();
    expect(sprintsInDatabase).toEqual([sprint]);
  });

  it('should create an sprint (with fake data functions)', async () => {
    const sprint = await repository.create(fakeSprint());

    expect(sprint).toEqual(sprintMatcher());

    const templateInDatabase = await selectSprints();
    expect(templateInDatabase).toEqual([sprint]);
  });
});

describe('findAll', () => {
  it('should return all sprints', async () => {
    const sprint1 = await repository.create({
      sprintCode: 'WD-1.1',
    });

    const sprint2 = await repository.create({
      sprintCode: 'DS-2.3',
    });

    const sprints = await repository.findAll();
    expect(sprints).toHaveLength(2);
    expect(sprints[0]).toEqual(sprintMatcher({ sprintCode: 'WD-1.1' }));
    expect(sprints[1]).toEqual(sprintMatcher({ sprintCode: 'DS-2.3' }));

    const sprintsInDatabase = await selectSprints();
    expect(sprintsInDatabase).toEqual([sprint1, sprint2]);
  });
});

describe('findById', () => {
  it('should return an sprint by id', async () => {
    const [sprint] = await createSprints(
      fakeSprint({
        id: 999,
      }),
    );

    const foundTemplate = await repository.findById(sprint!.id);

    expect(foundTemplate).toEqual(sprintMatcher());
  });

  it('should return undefined if sprint is not found', async () => {
    const foundSprint = await repository.findById(999999);

    expect(foundSprint).toBeUndefined();
  });
});

describe('update', () => {
  it('should update a sprint', async () => {
    const [sprint] = await createSprints(fakeSprint());

    const updatedSprint = await repository.update(sprint.id, {
      sprintCode: 'DS-1.1',
    });

    expect(updatedSprint).toMatchObject(
      sprintMatcher({
        sprintCode: 'DS-1.1',
      }),
    );
  });

  it('should return the original sprint if no changes are made', async () => {
    const [sprint] = await createSprints(fakeSprint());

    const updatedSprint = await repository.update(sprint.id, {});

    expect(updatedSprint).toMatchObject(sprintMatcher());
  });

  it('should return undefined if sprint is not found', async () => {
    const updatedSprint = await repository.update(999, {
      sprintCode: 'WD-1.1',
    });
    expect(updatedSprint).toBeUndefined();
  });
});

describe('remove', () => {
  it('should remove an template', async () => {
    const [sprint] = await createSprints(fakeSprint());

    const removedTemplate = await repository.remove(sprint.id);

    expect(removedTemplate).toEqual(sprintMatcher());
  });

  it('should return undefined if template is not found', async () => {
    const notFoundSprint = await repository.remove(999);

    expect(notFoundSprint).toBeUndefined();
  });
});
