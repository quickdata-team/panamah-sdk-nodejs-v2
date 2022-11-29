import { Compressor } from '../../core/useCases/compressor.useCase';
import {
  BaseError,
  XMLBadRequestError,
  NFEBadRequestError,
  NFEschemasBadRequestError,
} from '../../core/entities/erro';

/**
 * Método para salvar e enviar um XML de NFE
 * @export
 * @param {string} nfeContent
 * @param {boolean} [fromPath=true]
 * @return {*}  {(void
 *   | XMLBadRequestError
 *   | NFEBadRequestError
 *   | NFEschemasBadRequestError
 *   | BaseError)}
 */
export function send(
  nfeContent: string,
  fromPath: boolean = true
):
  | void
  | XMLBadRequestError
  | NFEBadRequestError
  | NFEschemasBadRequestError
  | BaseError {
  return new Compressor().send(nfeContent, fromPath);
}

export {
  UnprocessableEntityError,
  InternalServerError,
  ForbiddenError,
  ForbiddenSubscriberError,
  UnauthorizedPartnerError,
  UnauthorizedSubscriberError,
  NotFoundError,
  NotFoundPartnerError,
  NotFoundSubscriberError,
  BadRequestError,
  SubscriberBadRequestError,
  StreamBadRequestError,
  AdminBadRequestError,
  XMLBadRequestError,
  NFEBadRequestError,
  NFEschemasBadRequestError,
  SubscriberConflictError,
  BaseError,
} from '../../core/entities/erro';
