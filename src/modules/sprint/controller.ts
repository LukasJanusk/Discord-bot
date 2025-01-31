import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Database } from '@/database';
import buildRepository from './repository';
import { jsonRoute } from '@/utils/middleware';
import * as schema from './schema';
import {
  NotAllowedForSprint,
  NotAllowedForSprints,
  SprintNotFound,
} from './errors';

export default (db: Database) => {
  const router = Router();
  const sprints = buildRepository(db);

  router
    .route('/')
    .get(jsonRoute(sprints.findAll))
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body);

        return sprints.create(body);
      }, StatusCodes.CREATED),
    )
    .all(
      jsonRoute(async () => {
        throw new NotAllowedForSprints();
      }),
    );
  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const record = await sprints.findById(id);
        if (!record) {
          throw new SprintNotFound();
        }

        return record;
      }),
    )
    .patch(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const bodyPatch = schema.parseUpdateable(req.body);
        const record = await sprints.update(id, bodyPatch);

        if (!record) {
          throw new SprintNotFound();
        }

        return record;
      }),
    )
    .delete(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const record = await sprints.remove(id);

        if (!record) throw new SprintNotFound();

        return record;
      }),
    )
    .all(
      jsonRoute(async () => {
        throw new NotAllowedForSprint();
      }),
    );

  return router;
};
