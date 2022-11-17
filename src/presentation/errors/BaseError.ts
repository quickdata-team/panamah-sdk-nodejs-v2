import ExtendableError from 'es6-error';

export class BaseError extends ExtendableError {
  public readonly statusCode: number;

  constructor(name: string, message: string, statusCode = 4000) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}
