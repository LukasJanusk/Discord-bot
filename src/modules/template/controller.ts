import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as templates from './repository';
import * as schema from './schema';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const templateList = await templates.findAll();

    res.status(StatusCodes.OK).json(templateList);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: (error as Error).message,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const body = schema.parseInsertable(req.body);
    const article = await templates.create(body);

    res.status(StatusCodes.CREATED).json(article);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: (error as Error).message,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = schema.parseId(req.params.id);
    const template = await templates.findById(id);

    if (!template) {
      res.status(StatusCodes.NOT_FOUND).json({
        error: 'Article not found',
      });
      return;
    }

    res.status(StatusCodes.OK).json(template);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: (error as Error).message,
    });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const id = schema.parseId(req.params.id);
    const bodyPatch = schema.parsePartial(req.body);
    const article = await articles.update(id, bodyPatch);

    if (!article) {
      res.status(StatusCodes.NOT_FOUND).json({
        error: 'Article not found',
      });
      return;
    }

    res.status(StatusCodes.OK).json(article);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: (error as Error).message,
    });
  }
});

export default router;
