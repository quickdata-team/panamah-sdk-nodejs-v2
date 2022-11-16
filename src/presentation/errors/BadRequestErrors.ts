import { BaseError } from './BaseError';

export class BadRequestError extends BaseError {
  constructor() {
    super(
      'BadRequestError',
      'Requisão possui campos inválidos ou inexistentes'
    );
  }
}

export class SubscriberBadRequestError extends BaseError {
  constructor() {
    super(
      'SubscriberBadRequestError',
      'Requisão de assinante possui campos inválidos ou inexistentes',
      4001
    );
  }
}

export class StreamBadRequestError extends BaseError {
  constructor() {
    super(
      'StreamBadRequestError',
      'Requisão de envio de dados possui campos inválidos ou inexistentes',
      4002
    );
  }
}

export class AdminBadRequestError extends BaseError {
  constructor() {
    super(
      'AdminBadRequestError',
      'Requisão de cadastro possui campos inválidos ou inexistentes',
      4003
    );
  }
}

export class XMLBadRequestError extends BaseError {
  constructor() {
    super(
      'XMLBadRequestError',
      'XML enviado possui campos inválidos ou inexistentes',
      4004
    );
  }
}
