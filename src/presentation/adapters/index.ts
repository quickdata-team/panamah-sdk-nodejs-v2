import { Compressor, StreamingFlow, AdministrativeUseCase } from '@useCases';
import {
  Xml,
  AuthenticationEntity,
  IAuthenticationParameters,
  ConfigurationParameters,
  Mutex,
  Subscriber,
} from '@entities';
import {
  BaseError,
  XMLBadRequestError,
  NFEBadRequestError,
  NFEschemasBadRequestError,
} from '@errors';

const mutex = new Mutex();
const configurationParameters = new ConfigurationParameters();
const authenticationEntity = new AuthenticationEntity();

const streamingFlow = new StreamingFlow(
  mutex,
  authenticationEntity,
  configurationParameters
);
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
}: IAuthenticationParameters): Promise<void> {
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

/**
 * Retorna para o usuário metadados relacionados ao fluxo de envio
 * @export
 * @returns {*} {string}
 */
export function metadata(): string {
  const streamingFlowMetadata = StreamingFlow.metadata();
  return JSON.stringify(streamingFlowMetadata);
}

const compressor = new Compressor(mutex, authenticationEntity);
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

const XML = new Xml();
/**
 * Valida um XML
 * @export
 * @param {string} nfeContent
 * @param {boolean} fromPath
 */
export function validateXml(
  nfeContent: string,
  fromPath: boolean
):
  | boolean
  | XMLBadRequestError
  | NFEschemasBadRequestError
  | NFEBadRequestError {
  // Carrega XML
  if (fromPath) {
    XML.loadFromPath(nfeContent);
  } else {
    XML.loadFromString(nfeContent);
  }

  // Valida XML
  return XML.validate();
}

const administrativeUseCase = new AdministrativeUseCase(authenticationEntity);

/**
 * Cria um assinante
 * @export
 * @param {Subscriber} data
 * @return {*}  {Promise<any>}
 */
export function createSubscriber(data: Subscriber): Promise<any> {
  return administrativeUseCase.createSubscriber(data);
}

/**
 * Atualiza um assinante
 * @export
 * @param {string} id
 * @param {*} data
 * @return {*}  {Promise<any>}
 */
export function updateSubscriber(id: string, data: any): Promise<any> {
  return administrativeUseCase.updateSubscriber(id, data);
}

/**
 * Busca um assinante
 * @export
 * @param {string} id
 * @return {*}  {Promise<Subscriber>}
 */
export function getSubscriber(id: string): Promise<Subscriber> {
  return administrativeUseCase.getSubscriber(id);
}

/**
 * Deleta um assinante
 * @export
 * @param {string} id
 * @return {*}  {Promise<any>}
 */
export function deleteSubscriber(id: string): Promise<any> {
  return administrativeUseCase.deleteSubscriber(id);
}
