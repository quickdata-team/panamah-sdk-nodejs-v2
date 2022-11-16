import { BaseError } from './BaseError';

export class UnprocessableEntityError extends BaseError {
  constructor() {
    super(
      'UnprocessableEntityError',
      'A entidade enviada possui erros de semanticas, verifique os tipos enviados.',
      4220
    );
  }
}
