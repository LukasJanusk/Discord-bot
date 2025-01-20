import express from 'express';
import { type Database } from './database';
import jsonErrorHandler from './middleware/jsonErrors';
import templates from './modules/template/controller';

export default function createApp(db: Database) {
  const app = express();

  app.use(express.json());
  app.use('/templates', templates(db));
  app.use(jsonErrorHandler);

  return app;
}
