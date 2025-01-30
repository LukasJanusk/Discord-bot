/* eslint-disable max-classes-per-file */
import { StatusCodes } from 'http-status-codes';
import NotFound from '@/utils/errors/NotFound';
import DatabaseError from '@/utils/errors/DatabaseError';

export class UserNotFound extends NotFound {
  constructor(message = 'Username not found') {
    super(message);
  }
}
export class GifNotFound extends NotFound {
  constructor(message = 'GIF not found') {
    super(message);
  }
}

export class MessageCreationFailed extends DatabaseError {
  constructor(message = 'Message creation failed') {
    super(message);
  }
}

export class UserCreationFailed extends DatabaseError {
  constructor(message = 'User creation failed') {
    super(message);
  }
}

export class GifCreationFailed extends DatabaseError {
  constructor(message = 'Gif creation failed') {
    super(message);
  }
}

export class DiscordBotError extends Error {
  status: number;

  constructor(message: string = 'An error occurred in the Discord Bot') {
    super(message);
    this.status = StatusCodes.BAD_GATEWAY;
  }
}
