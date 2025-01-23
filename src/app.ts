import express from 'express';
import { type Database } from './database';
import jsonErrorHandler from './middleware/jsonErrors';
import templates from './modules/template/controller';
import messages from './modules/message/controller';

export default async function createApp(db: Database) {
  const app = express();

  app.use(express.json());
  app.use('/templates', templates(db));
  const messagesRouter = await messages(db);
  app.use('/messages', messagesRouter);
  app.use(jsonErrorHandler);

  return app;
}
