import express from 'express';
import { type Database } from './database';
import jsonErrorHandler from './middleware/jsonErrors';
import templates from './modules/template/controller';
import sprints from './modules/sprint/controller';
import messages from './modules/message/controller';
import { DiscordBot } from './modules/message/services/discord';
import { GifAPI } from './modules/message/services/giphy';

export default function createApp(
  db: Database,
  discordBot: DiscordBot,
  gifApi: GifAPI,
) {
  const app = express();

  app.use(express.json());
  app.use('/templates', templates(db));
  app.use('/sprints', sprints(db));
  app.use('/messages', messages(db, discordBot, gifApi));
  app.use(jsonErrorHandler);

  return app;
}
