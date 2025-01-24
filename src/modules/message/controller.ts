import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DISCORD_BOT_TOKEN, CHANNEL_ID } from 'config';
import { Database } from '@/database';
import { jsonRoute } from '@/utils/middleware';
import buildRepository from './repository';
import buildRepositoryTemplates from '../template/repository';
import createDiscordBot from './services/discord/discord';
import createGiphyApi from './services/giphy/giphy';
import * as schema from './schema';
import { MessageCreationFailed, SprintNotFound } from '../sprint/errors';
import { MessageNotFound, UserNotFound } from './errors';
import pickRandom from '@/utils/random';
import { TemplateNotFound } from '../template/errors';

export default async (db: Database) => {
  const router = Router();
  const messages = buildRepository(db);
  const templates = buildRepositoryTemplates(db);
  const giphyApi = createGiphyApi();
  const discordBot = await createDiscordBot(DISCORD_BOT_TOKEN, CHANNEL_ID);

  router
    .route('/')
    .get(jsonRoute(messages.findAll))
    .post(
      jsonRoute(async (req) => {
        const { username, sprintCode } = schema.parseRequestObject(req.body);
        const sprintInDatabase = await messages.findSprint(sprintCode);
        if (!sprintInDatabase) {
          throw new SprintNotFound();
        }
        const user = await messages.createUser({ username });
        if (!user) throw new UserNotFound();
        const gif = await giphyApi.fetchGIF('success');
        const allTemplates = await templates.findAll();
        if (allTemplates.length < 1) {
          throw new TemplateNotFound();
        }
        const template = pickRandom(allTemplates);
        const sent = await discordBot.sendToChannel(
          `${username} completed: ${sprintCode}, ${template}`,
          username,
          gif || undefined,
        );
        if (sent) {
          const message = await messages.create({
            sentAt: new Date().toISOString(),
            sprintId: sprintInDatabase.id,
            templateId: template.id,
            userId: user.id,
          });
          return message;
        }
        throw new MessageCreationFailed();
      }, StatusCodes.CREATED),
    );
  router.route('/:username').get(
    jsonRoute(async (req) => {
      const username = schema.parseUser(req.params.username);
      const record = await messages.findByUsername(username);

      if (!record) {
        throw new MessageNotFound();
      }

      return record;
    }),
  );

  router.route('/:sprint').get(
    jsonRoute(async (req) => {
      const sprintCode = schema.parseSprint(req.params.sprintCode);
      const record = await messages.findBySprint(sprintCode);

      if (!record) {
        throw new MessageNotFound();
      }
      return record;
    }),
  );

  return router;
};
