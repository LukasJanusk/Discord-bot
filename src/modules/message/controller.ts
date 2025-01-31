import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Database } from '@/database';
import { jsonRoute } from '@/utils/middleware';
import buildRepository from './repository';
import buildGifRepository from './services/giphy/repository';
import buildRepositoryTemplates from '../template/repository';
import * as schema from './schema';
import { SprintNotFound } from '../sprint/errors';
import {
  MessageCreationFailed,
  UserCreationFailed,
  GifCreationFailed,
  GifNotFound,
  DiscordBotError,
  NotAllowedForSprint,
  NotAllowedForUsername,
  NotAllowedForMessage,
} from './errors';
import pickRandom from '@/utils/random';
import { TemplateNotFound } from '../template/errors';
import { DiscordBot } from './services/discord';
import { GifAPI } from './services/giphy';
import { getLocalGif } from './utils';
import { parseInsertable as parseLocallyStoredGif } from './services/giphy/schema';

export default (db: Database, discordBot: DiscordBot, gifApi: GifAPI) => {
  const router = Router();
  const messages = buildRepository(db);
  const gifs = buildGifRepository(db);
  const templates = buildRepositoryTemplates(db);

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
        if (!user) throw new UserCreationFailed();

        let gif;
        let finalGifId = null;

        const apiGif = await gifApi.fetchGIF('success');
        if (apiGif) {
          const fullGif = await gifs.create(apiGif);
          if (!fullGif) {
            throw new GifCreationFailed();
          }
          gif = fullGif;
          finalGifId = fullGif.id;
        } else {
          const localGif = await getLocalGif(gifs.findAll);
          if (!localGif) throw new GifNotFound();
          gif = parseLocallyStoredGif(localGif);
          finalGifId = localGif.id;
        }
        const allTemplates = await templates.findAll();
        if (allTemplates.length < 1) {
          throw new TemplateNotFound();
        }
        const template = pickRandom(allTemplates);
        const sent = await discordBot.sendToChannel(
          ` completed: ${sprintCode}. ${template.text}`,
          username,
          gif,
        );
        if (sent) {
          const message = await messages.create({
            sentAt: new Date().toISOString(),
            sprintId: sprintInDatabase.id,
            templateId: template.id,
            userId: user.id,
            gifId: finalGifId,
          });
          if (!message) throw new DiscordBotError();
          return message;
        }
        throw new MessageCreationFailed();
      }, StatusCodes.CREATED),
    )
    .all(
      jsonRoute(async () => {
        throw new NotAllowedForMessage();
      }),
    );
  router
    .route('/username/:username')
    .get(
      jsonRoute(async (req) => {
        const username = schema.parseUser(req.params.username);
        const record = await messages.findByUsername(username);

        return record;
      }),
    )
    .all(
      jsonRoute(async () => {
        throw new NotAllowedForUsername();
      }),
    );

  router
    .route('/sprint/:sprint')
    .get(
      jsonRoute(async (req) => {
        const sprintCode = schema.parseSprint(req.params.sprint);
        const record = await messages.findBySprint(sprintCode);

        return record;
      }),
    )
    .all(
      jsonRoute(() => {
        throw new NotAllowedForSprint();
      }),
    );
  return router;
};
