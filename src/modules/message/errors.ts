/* eslint-disable max-classes-per-file */
import NotFound from '@/utils/errors/NotFound';

export class MessageNotFound extends NotFound {
  constructor(message = 'Message not found') {
    super(message);
  }
}

export class UserNotFound extends NotFound {
  constructor(message = 'Username not found') {
    super(message);
  }
}
export class MessageCreationFailed extends Error {
  constructor(message = 'Message creation failed') {
    super(message);
  }
}
