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
  DraftNotFound,
  DiscordBotError,
  NotAllowedForSprint,
  NotAllowedForUsername,
  NotAllowedForMessages,
} from './errors';
import pickRandom from '@/utils/random';
import { TemplateNotFound } from '../template/errors';
import { DiscordBot } from './services/discord';
import { GifAPI } from './services/giphy';
import { formatMessageForDiscord, getLocalGif } from './utils';
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
        const sprint = await messages.findSprint(sprintCode);
        if (!sprint) {
          throw new SprintNotFound();
        }
        const userDb = await messages.createUser({ username });
        if (!userDb) throw new UserCreationFailed();
        const user = await discordBot.getUser(username);
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
        const template = await templates.findById(1);
        if (!template) {
          throw new TemplateNotFound();
        }
        const drafts = await messages.findDrafts();
        if (drafts.length < 1) throw new DraftNotFound();
        const draft = pickRandom(drafts);
        const formattedMessageText = formatMessageForDiscord(
          template.text,
          sprint.title,
          draft.text,
          user.id,
        );

        const formattedMessageTextForDb = formatMessageForDiscord(
          template.text,
          sprint.title,
          draft.text,
          user.displayName,
        );
        const sent = await discordBot.sendToChannel(formattedMessageText, gif);
        if (sent) {
          const message = await messages.create({
            sentAt: new Date().toISOString(),
            sprintId: sprint.id,
            templateId: template.id,
            userId: userDb.id,
            gifId: finalGifId,
            text: formattedMessageTextForDb,
          });
          if (!message) throw new DiscordBotError();
          return message;
        }
        throw new MessageCreationFailed();
      }, StatusCodes.CREATED),
    )
    .all(
      jsonRoute(async () => {
        throw new NotAllowedForMessages();
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
