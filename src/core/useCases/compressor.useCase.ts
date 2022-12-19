import { Xml, Storage, AuthenticationEntity, Mutex } from '@entities';
import {
  BaseError,
  XMLBadRequestError,
  NFEBadRequestError,
  NFEschemasBadRequestError,
  ForbiddenUserError,
} from '@errors';

export class Compressor {
  private mutex;

  private authenticationEntity;

  constructor(mutex: Mutex, authenticationEntity: AuthenticationEntity) {
    this.mutex = mutex;
    this.authenticationEntity = authenticationEntity;
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
  public async send(
    nfeContent: string,
    fromPath: boolean = true
  ): Promise<
    | void
    | XMLBadRequestError
    | NFEBadRequestError
    | NFEschemasBadRequestError
    | BaseError
  > {
    await this.mutex.checkForBlocking();

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
    if (!this.authenticationEntity.isAuthenticated())
      throw new ForbiddenUserError();

    // Cria diretorio para salvar o XML
    Storage.createDir();

    // Cria nome unico
    const fileName = Storage.createFileName(XML);

    // Salva XML
    Storage.save(fileName, XML);
  }
}
