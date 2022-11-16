import { BaseError } from './BaseError';

export class InternalServerError extends BaseError {
  constructor() {
    super('InternalServerError', 'Erro interno no servidor', 5000);
  }
}
