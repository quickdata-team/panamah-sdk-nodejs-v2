import { Xml } from '../entities/xml.entity';
import { Storage } from '../entities/storage.entity';
import {
  BaseError,
  XMLBadRequestError,
  NFEBadRequestError,
  NFEschemasBadRequestError,
} from '../entities/erro';

export class Compressor extends Storage {
  public authetication: boolean = true;

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

    // Autentica usuario
    this.authenticate();

    // Cria diretorio para salvar o XML
    this.createDir();

    // Cria nome unico
    const fileName = this.createFileName(XML);

    // Salva XML
    this.save(fileName, XML);
  }

  private authenticate() {
    return this.authetication;
  }
}
