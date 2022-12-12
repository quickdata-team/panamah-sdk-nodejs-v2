import { Xml } from '../entities/xml.entity';
import { Storage } from '../entities/storage.entity';
import {
  BaseError,
  XMLBadRequestError,
  NFEBadRequestError,
  NFEschemasBadRequestError,
  ForbiddenUserError,
} from '../entities/erro';
import { StreamingFlow } from './streamingFlow.useCase';

export class Compressor {
  public authetication: boolean = true;

  private streamingFlow: StreamingFlow;

  constructor(streamingFlow: StreamingFlow) {
    this.streamingFlow = streamingFlow;
  }

  /**
   * Armazenamento e controle dos XML
   * @param {string} nfeContent
   * @param {boolean} [fromPath=true]
   * @return {*}  {(void
   *     | XMLBadRequestError
   *     | NFEBadRequestError
   *     | NFEschemasBadRequestError
   *     | BaseError)}
   * @memberof Compressor
   */
  public send(
    nfeContent: string,
    fromPath: boolean = true
  ):
    | void
    | XMLBadRequestError
    | NFEBadRequestError
    | NFEschemasBadRequestError
    | BaseError {
    const XML = new Xml();

    // Carrega XML
    if (fromPath) {
      XML.loadFromPath(nfeContent);
    } else {
      XML.loadFromString(nfeContent);
    }

    // Valida XML
    XML.validate();

    // Verifica autenticação
    if (!this.streamingFlow.isAuthenticated()) throw new ForbiddenUserError();

    // Cria diretorio para salvar o XML
    Storage.createDir();

    // Cria nome unico
    const fileName = Storage.createFileName(XML);

    // Salva XML
    Storage.save(fileName, XML);
  }
}
