import { BaseError } from './BaseError';

export class UnauthorizedSubscriberError extends BaseError {
  constructor() {
    super(
      'UnauthorizedSubscriberError',
      'Assinante não possui autenticação',
      4011
    );
  }
}

export class UnauthorizedPartnerError extends BaseError {
  constructor() {
    super('UnauthorizedPartnerError', 'Parceiro não possui autenticação', 4012);
  }
}

export class InvalidApiKeyHeaderError extends BaseError {
  constructor() {
    super('InvalidApiKeyHeaderError', 'Cabeçalho x-api-key inválido', 4015);
  }
}
