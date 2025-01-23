import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DISCORD_BOT_TOKEN, CHANNEL_ID } from 'config';
import { Database } from '@/database';
import { jsonRoute } from '@/utils/middleware';
// import buildRepository from './repository';
// import * as schema from './schema';
// import { MessageNotFound } from './errors';
import createDiscordBot from './services/discord';
import createGiphyApi from './services/giphy';
import * as schema from './schema';

export default async (db: Database) => {
  const router = Router();
  // const messages = buildRepository(db);
  const giphyApi = createGiphyApi();
  const bot = await createDiscordBot(DISCORD_BOT_TOKEN, CHANNEL_ID);

  router
    .route('/')
    // .get(jsonRoute(messages.findAll))
    .post(
      jsonRoute(async (req) => {
        // Needs additional logic to create a message by assigning text message
        // Create user in database and assigning it to message
        // Assign sprint Id to the message
        // Add timestamp and save to db
        // Send message using discord bot
        // send back created message body
        const { username, sprintCode } = schema.parseRequestObject(req.body);
        // const messageBody = messages.create(body);
        const gif = await giphyApi.fetchGIF('congratulations');
        const sent = await bot.sendToChannel(`test`, gif || undefined);
        return sent;
      }, StatusCodes.CREATED),
    );
  // router.route('/:discordName').get(
  //   jsonRoute(async (req) => {
  //     const discordName = schema.parseName(req.params.discordName);
  //     const record = await messages.findByName(discordName);

  //     if (!record) {
  //       throw new MessageNotFound();
  //     }

  //     return record;
  //   }),
  // );

  // router.route('/:sprint').get(
  //   jsonRoute(async (req) => {
  //     const sprint = schema.parseSprint(req.params.sprint);
  //     const record = await messages.findBySprint(sprint);

  //     if (!record) {
  //       throw new MessageNotFound();
  //     }
  //     return record;
  //   }),
  // );

  return router;
};
