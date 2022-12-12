export { NodeLibxml as LibXml } from '../externalInterfaces/xmlLib/node-libxml';

export { AxiosHttpClient as HttpClient } from '../externalInterfaces/httpClient/implementations/AxiosHttpClient';
export {
  IHttpClient,
  IAuthResponse,
} from '../externalInterfaces/httpClient/IHttpClient';

export {
  BadRequestError,
  SubscriberBadRequestError,
  StreamBadRequestError,
  AdminBadRequestError,
  XMLBadRequestError,
  NFEBadRequestError,
  NFEschemasBadRequestError,
  SubscriberConflictError,
  ForbiddenError,
  ForbiddenSubscriberError,
  NotFoundError,
  NotFoundPartnerError,
  NotFoundSubscriberError,
  UnauthorizedPartnerError,
  UnauthorizedSubscriberError,
  UnprocessableEntityError,
  InternalServerError,
} from '../../core/entities/erro';

export { NfeXml as LibNfe } from '../externalInterfaces/nfeLib';
export { FsLib as LibStorage } from '../externalInterfaces/storageLib';
export { LogLib as LibLogger } from '../externalInterfaces/loggerLib';
