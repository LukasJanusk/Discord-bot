import express from 'express';
import { type Database } from './database';
import jsonErrorHandler from './middleware/jsonErrors';
import templates from './modules/template/controller';
import { DiscordBot } from './modules/message/services/discord';

export default async function createApp(db: Database, bot: DiscordBot) {
  const app = express();

  app.use(express.json());
  app.use('/templates', templates(db));
  app.use(jsonErrorHandler);

  return app;
}
