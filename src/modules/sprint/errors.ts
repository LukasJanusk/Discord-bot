/* eslint-disable max-classes-per-file */
import MethodNotAllowed from '@/utils/errors/MethodNotAllowed';
import NotFound from '@/utils/errors/NotFound';

export class SprintNotFound extends NotFound {
  constructor(message = 'Sprint not found') {
    super(message);
  }
}

export class NotAllowedForSprints extends MethodNotAllowed {
  constructor(message = 'Method not allowed for /sprints') {
    super(message);
  }
}
export class NotAllowedForSprint extends MethodNotAllowed {
  constructor(message = 'Method not allowed for /sprints/:id') {
    super(message);
  }
}
