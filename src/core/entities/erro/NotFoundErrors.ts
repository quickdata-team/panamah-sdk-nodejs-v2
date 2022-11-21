import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor() {
    super('NotFoundError', 'Recurso especificado não existe', 4040);
  }
}
export class NotFoundSubscriberError extends BaseError {
  constructor() {
    super(
      'NotFoundSubscriberError',
      'O assinante especificado não existe',
      4041
    );
  }
}
export class NotFoundPartnerError extends BaseError {
  constructor() {
    super('NotFoundPartnerError', 'O parceiro especificado não existe', 4042);
  }
}
