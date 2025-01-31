/* eslint-disable max-classes-per-file */
import MethodNotAllowed from '@/utils/errors/MethodNotAllowed';
import NotFound from '@/utils/errors/NotFound';

export class TemplateNotFound extends NotFound {
  constructor(message = 'Template not found') {
    super(message);
  }
}

export class NotAllowedForTemplates extends MethodNotAllowed {
  constructor(message = 'Method not allowed for /templates') {
    super(message);
  }
}
export class NotAllowedForTemplate extends MethodNotAllowed {
  constructor(message = 'Method not allowed for /templates/:id') {
    super(message);
  }
}
