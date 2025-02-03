import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import { it, describe, expect, afterAll, afterEach } from 'vitest';
import buildRepository from '../repository';
import { fakeGif, gifMatcher } from './utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createGifs = createFor(db, 'gif');
const selectGifs = selectAllFor(db, 'gif');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('gif').execute();
});

describe('create', () => {
  it('should create a Gif with all fields', async () => {
    const gif = await repository.create({
      apiId: '1',
      height: 400,
      url: 'fake_url',
      width: 300,
    });

    expect(gif).toEqual({
      id: expect.any(Number),
      apiId: '1',
      height: 400,
      url: 'fake_url',
      width: 300,
    });
  });
  it('should create a Gif with missing non required fields', async () => {
    const sprint = await repository.create({
      url: 'fake_url',
    });
    expect(sprint).toEqual({
      id: expect.any(Number),
      url: 'fake_url',
      apiId: null,
      height: null,
      width: null,
    });
    const gifs = await selectGifs();
    expect(gifs).toEqual([sprint]);
  });

  it('should create a Gif (with fake data functions)', async () => {
    const gif = await repository.create(fakeGif());

    expect(gif).toEqual(gifMatcher());

    const gifsInDatabase = await selectGifs();
    expect(gifsInDatabase).toEqual([gif]);
  });
  it('should return original gif if it already in db', async () => {
    const gifInDb = await repository.create({ url: 'url.already.indb' });
    const originalGif = await repository.create({ url: 'url.already.indb' });
    expect(gifInDb).toEqual(originalGif);
  });
});

describe('findAll', () => {
  it('should return all Gifs', async () => {
    const g1 = fakeGif({
      apiId: '1',
      height: 200,
      url: 'fake_url',
      width: 300,
    });
    const g2 = fakeGif({
      apiId: '1',
      height: 400,
      url: 'fake_url2',
      width: 300,
    });
    const gif1 = await repository.create(g1);

    const gif2 = await repository.create(g2);

    const gifs = await repository.findAll();
    expect(gifs).toHaveLength(2);
    expect(gifs[0]).toEqual(gifMatcher(g1));
    expect(gifs[1]).toEqual(gifMatcher(g2));

    const gifsInDatabase = await selectGifs();
    expect(gifsInDatabase).toEqual([gif1, gif2]);
  });
});

describe('findById', () => {
  it('should return an Gif by id', async () => {
    const [gif] = await createGifs(
      fakeGif({
        id: 666,
      }),
    );

    const foundGif = await repository.findById(gif!.id);

    expect(foundGif).toEqual(gifMatcher());
  });

  it('should return undefined if Gif is not found', async () => {
    const foundGif = await repository.findById(999999);

    expect(foundGif).toBeUndefined();
  });
});

describe('update', () => {
  it('should update a GIf', async () => {
    const [gif] = await createGifs(fakeGif());

    const updatedGif = await repository.update(gif.id, {
      url: 'new_url',
      apiId: '1',
    });

    expect(updatedGif).toMatchObject(
      gifMatcher({
        apiId: '1',
        url: 'new_url',
      }),
    );
  });

  it('should return the original Gif if no changes are made', async () => {
    const [gif] = await createGifs(fakeGif());

    const updatedGif = await repository.update(gif.id, {});

    expect(updatedGif).toMatchObject(gifMatcher());
  });

  it('should return undefined if sprint is not found', async () => {
    const updatedGif = await repository.update(999, {
      url: 'some_url',
    });
    expect(updatedGif).toBeUndefined();
  });
});

describe('remove', () => {
  it('should remove an gif', async () => {
    const [gif] = await createGifs(fakeGif());

    const removedGif = await repository.remove(gif.id);

    expect(removedGif).toEqual(gifMatcher());
  });

  it('should return undefined if Gif is not found', async () => {
    const notFoundGif = await repository.remove(999);

    expect(notFoundGif).toBeUndefined();
  });
});
