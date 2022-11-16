import { BaseError } from './BaseError';

export class SubscriberConflictError extends BaseError {
  constructor() {
    super(
      'SubscriberConflictError',
      'O assinante especificado já existe',
      4091
    );
  }
}
