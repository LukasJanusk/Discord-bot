/* eslint-disable max-classes-per-file */
import NotFound from '@/utils/errors/NotFound';

export class SprintNotFound extends NotFound {
  constructor(message = 'Sprint not found') {
    super(message);
  }
}
export class MessageCreationFailed extends Error {
  constructor(message = 'Message creation failed') {
    super(message);
  }
}
