import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Database } from '@/database';
import { jsonRoute } from '@/utils/middleware';
import buildRepository from './repository';
import * as schema from './schema';
import { TemplateNotFound } from './errors';

export default (db: Database) => {
  const router = Router();
  const templates = buildRepository(db);

  router
    .route('/')
    .get(jsonRoute(templates.findAll))
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body);

        return templates.create(body);
      }, StatusCodes.CREATED),
    );
  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const record = await templates.findById(id);

        if (!record) {
          throw new TemplateNotFound();
        }

        return record;
      }),
    )
    .patch(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const bodyPatch = schema.parseUpdateable(req.body);
        const record = await templates.update(id, bodyPatch);

        if (!record) {
          throw new TemplateNotFound();
        }

        return record;
      }),
    )
    .delete(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const record = await templates.remove(id);

        if (!record) {
          throw new TemplateNotFound();
        }

        return record;
      }),
    );

  return router;
};
