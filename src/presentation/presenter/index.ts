import { Compressor, StreamingFlow, AdministrativeUseCase } from '@useCases';
import {
  BaseError,
  XMLBadRequestError,
  NFEBadRequestError,
  NFEschemasBadRequestError,
} from '@errors';

export type IinitParameters = {
  username: string;
  password: string;
};

const streamingFlow = new StreamingFlow();
/**
 * Inicia o fluxo de envio
 * @export
 * @param {IinitParameters} {
 *   username,
 *   password,
 * }
 * @return {*}  {Promise<void>}
 */
export async function init({
  username,
  password,
}: IinitParameters): Promise<void> {
  return streamingFlow.init({ username, password });
}

/**
 * Para o fluxo de envio e envia o que estiver pendente
 * @export
 * @return {*}  {void}
 */
export async function stop(): Promise<void> {
  return streamingFlow.terminate();
}

const compressor = new Compressor(streamingFlow);

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
export async function send(
  nfeContent: string,
  fromPath: boolean = true
): Promise<
  | void
  | XMLBadRequestError
  | NFEBadRequestError
  | NFEschemasBadRequestError
  | BaseError
> {
  return compressor.send(nfeContent, fromPath);
}

export const administrative = new AdministrativeUseCase();

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
