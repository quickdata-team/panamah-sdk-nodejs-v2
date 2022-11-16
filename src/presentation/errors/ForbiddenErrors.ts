import { BaseError } from './BaseError';

export class ForbiddenError extends BaseError {
  constructor() {
    super(
      'ForbiddenError',
      'Cliente não possui acesso ao recurso solicitado',
      4030
    );
  }
}

export class ForbiddenSubscriberError extends BaseError {
  constructor() {
    super(
      'ForbiddenSubscriberError',
      'O assinante não pretence ao parceiro',
      4031
    );
  }
}
